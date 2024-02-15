package org.fhir.irccs.service;


import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.MultivaluedHashMap;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.hl7.fhir.r5.model.Bundle;
import org.hl7.fhir.r5.model.Group;
import org.hl7.fhir.r5.model.Reference;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.GroupResource;
import org.keycloak.admin.client.resource.GroupsResource;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@ApplicationScoped
public class GroupService {
    private final static Logger LOG = LoggerFactory.getLogger(GroupService.class);
    @Inject
    Keycloak keycloak;
    @Inject
    GroupController groupController;

    @Inject
    PractitionerController practitionerController;

    @Inject
    UserService userService;

    @ConfigProperty(name = "quarkus.keycloak.admin-client.realm")
    String realm;

    private RealmResource getRealm(){return keycloak.realm(realm);}

    public Response getAllGroups(String name) {
        if(name.isEmpty()) return Response.ok(getRealm().groups().groups(null, null, null, false)).build();
        return getGroupByName(name);
    }

    public Response createGroup(org.fhir.irccs.entity.Group group) {
        // Creating Keycloak Group Representation

        GroupRepresentation groupRepresentation = new GroupRepresentation();
        groupRepresentation.setName(group.getName());

        GroupsResource groupsResource = getRealm().groups();
        groupsResource.add(groupRepresentation);

        GroupRepresentation foundGroup = groupsResource.groups(group.getName(), 0, 1).get(0);
        Objects.requireNonNull(foundGroup);


        List<Group.GroupMemberComponent> practitionerReferences = new ArrayList<>();
        for(String email : group.getMembers()){
            userService.joinGroup(email, foundGroup);
            practitionerReferences.add(new Group.GroupMemberComponent().setEntity(new Reference(userService.getUserByEmail_fhir(email).getId())));
        }

        Group fhirGroup = new Group();
        fhirGroup.setName(group.getName());
        fhirGroup.setMember(practitionerReferences);


        String groupCreated = groupController.create(groupController.encodeResourceToString(fhirGroup));
        LOG.info("Group created: {}", groupCreated);

        return Response.ok().status(Response.Status.CREATED).build();

    }

    private Response getGroupByName(String name) {
        return Response.ok(getRealm().groups().groups(name, 0, 1, false)).build();
    }

    public GroupRepresentation getGroupByName_representation(String name) {
        return getRealm().groups().groups(name, 0, 1, false).get(0);
    }

    public Response updateGroup(org.fhir.irccs.entity.Group group) {

        GroupsResource groupsResource = getRealm().groups();
        GroupRepresentation foundGroup = groupsResource.groups(group.getName(), 0, 1).get(0);
        Objects.requireNonNull(foundGroup);
        GroupResource groupResource = groupsResource.group(foundGroup.getId());
        foundGroup.setName(group.getName());
        groupResource.update(foundGroup);

        List<Group.GroupMemberComponent> practitionerReferences = new ArrayList<>();
        for(UserRepresentation user : groupResource.members()){
            userService.leaveGroup(user.getEmail(), foundGroup);
        }

        for(String email : group.getMembers()){
            userService.joinGroup(email, foundGroup);
            practitionerReferences.add(new Group.GroupMemberComponent().setEntity(new Reference(userService.getUserByEmail_fhir(email).getId())));
        }



        // Updating Fhir Practitioner Resource
        MultivaluedMap<String, String> params = new MultivaluedHashMap<>();
        params.put("name", Collections.singletonList(group.getName()));

        Group fhirGroup = (Group) groupController.parseResource(groupController.search(params), Bundle.class).getEntry().get(0).getResource();
        Objects.requireNonNull(fhirGroup);
        fhirGroup.setName(group.getName());
        fhirGroup.setMember(practitionerReferences);

        String groupUpdated = groupController.update(fhirGroup.getIdPart(), groupController.encodeResourceToString(fhirGroup));
        LOG.info("Group updated: {}", groupUpdated);

        return Response.ok().status(Response.Status.ACCEPTED).build();

    }

    public Response deleteGroup(String name) {

        GroupsResource groupsResource = getRealm().groups();
        GroupRepresentation foundGroup = groupsResource.query(name).get(0);
        Objects.requireNonNull(foundGroup);
        GroupResource groupResource = groupsResource.group(foundGroup.getId());
        groupResource.remove();


        MultivaluedMap<String, String> params = new MultivaluedHashMap<>();
        params.put("name", Collections.singletonList(name));

        Group group = (Group) groupController.parseResource(groupController.search(params), Bundle.class).getEntry().get(0).getResource();
        Objects.requireNonNull(group);

        groupController.delete(group.getIdPart());

        return Response.ok().status(Response.Status.OK).build();

    }

}

