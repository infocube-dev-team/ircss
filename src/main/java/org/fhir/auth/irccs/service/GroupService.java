package org.fhir.auth.irccs.service;


import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.MultivaluedHashMap;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.fhir.auth.irccs.RollbackSystem.Command;
import org.fhir.auth.irccs.RollbackSystem.RollbackManager;
import org.fhir.auth.irccs.entity.User;
import org.fhir.auth.irccs.exceptions.OperationException;
import org.hl7.fhir.instance.model.api.IIdType;
import org.hl7.fhir.r5.model.*;
import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.client.impl.ClientResponseImpl;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.GroupResource;
import org.keycloak.admin.client.resource.GroupsResource;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.quarkus.irccs.client.restclient.FhirClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

@ApplicationScoped
public class GroupService {
    private final static Logger LOG = LoggerFactory.getLogger(GroupService.class);
    @Inject
    Keycloak keycloak;
    @Inject
    FhirClient<Group> groupController;

    @Inject
    UserService userService;

    @ConfigProperty(name = "quarkus.keycloak.admin-client.realm")
    String realm;

    private RealmResource getRealm(){return keycloak.realm(realm);}

    public Response getAllGroups(String name) {
        if(name.isEmpty()) return Response.ok(getRealm().groups().groups(null, null, null, false)).build();
        return getGroupByName(name);
    }

    public Response createGroup(org.fhir.auth.irccs.entity.Group group) throws OperationException{
        RollbackManager rollbackManager = new RollbackManager();

        AtomicReference<org.fhir.auth.irccs.entity.Group> keycloakGroupRef = new AtomicReference<>();

        rollbackManager.addCommand(new Command(
                () -> {
                    Response keycloakGroup = createKeycloakGroup(group);
                    keycloakGroupRef.set(keycloakGroup.readEntity(org.fhir.auth.irccs.entity.Group.class)); // Set the result in the AtomicReference
                    keycloakGroup.close();
                },
                () -> {}
        ));

        rollbackManager.addCommand(new Command(
                () -> createFhirGroup(keycloakGroupRef.get()).close(),
                () -> {}
        ));

        try {
            rollbackManager.executeCommands();
        } catch (Exception e){
            throw new OperationException(e.getMessage(), OperationOutcome.IssueSeverity.ERROR);
        }

        return Response.ok(group).build();
    }

    public Response createKeycloakGroup(org.fhir.auth.irccs.entity.Group group) {
        try {
            GroupRepresentation groupRepresentation = new GroupRepresentation();
            GroupsResource groupsResource = getRealm().groups();
            groupRepresentation.setName(group.getName());
            groupRepresentation.setAttributes(new HashMap<>(){{
                put("organizations", group.getOrganizations());
            }});
            Response groupCreatedRes =  groupsResource.add(groupRepresentation);
            GroupRepresentation groupCreated = groupsResource.group(CreatedResponseUtil.getCreatedId(groupCreatedRes)).toRepresentation();
            for (String email : group.getMembers()) {
                userService.joinGroup(email, groupCreated);
            }
            group.setId(groupCreated.getId());
            return Response.ok(group).build();
        } catch (Exception e) {
            LOG.error("Error creating Keycloak group: " + group.getName(), e);
            throw e;
        }
    }

    public Response createFhirGroup(org.fhir.auth.irccs.entity.Group group) {
        try {
            Group fhirGroup = new Group();
            List<Group.GroupMemberComponent> practitionerReferences = new ArrayList<>();
            for (String email : group.getMembers()) {
                practitionerReferences.add(new Group.GroupMemberComponent().setEntity(new Reference(userService.getUserByEmail_fhir(email).getId())));
            }
            fhirGroup.setName(group.getName());
            fhirGroup.setMember(practitionerReferences);
            fhirGroup.setIdentifier(List.of(new Identifier().setUse(Identifier.IdentifierUse.SECONDARY).setValue(group.getId())));
            groupController.create(fhirGroup);
            return Response.ok(group).build();
        } catch (Exception e) {
            LOG.error("Error creating Fhir group: " + group.getName(), e);
            throw e;
        }
    }

    /*public Response createGroup(org.fhir.auth.irccs.entity.Group group) {
        // Creating Keycloak Group Representation

        GroupRepresentation groupRepresentation = new GroupRepresentation();
        groupRepresentation.setName(group.getName());

        GroupsResource groupsResource = getRealm().groups();
        Response KCgroupCreated = groupsResource.add(groupRepresentation);

        String keycloakGroupId = CreatedResponseUtil.getCreatedId(KCgroupCreated);


        GroupRepresentation foundGroup = groupsResource.groups(group.getName(), 0, 1).get(0);
        Objects.requireNonNull(foundGroup);


        List<Group.GroupMemberComponent> practitionerReferences = new ArrayList<>();
        for(String email : group.getMembers()){
            userService.joinGroup(email, foundGroup);
            try {
                practitionerReferences.add(new Group.GroupMemberComponent().setEntity(new Reference(userService.getUserByEmail_fhir(email).getId())));
            } catch (Exception e){
                e.printStackTrace();
                throw new OperationException("Couldn't find FHIR practitioner", OperationOutcome.IssueSeverity.ERROR);
            }
        }

        Group fhirGroup = new Group();
        fhirGroup.setName(group.getName());
        fhirGroup.setMember(practitionerReferences);
        fhirGroup.setIdentifier(List.of(new Identifier().setUse(Identifier.IdentifierUse.SECONDARY).setValue(keycloakGroupId)));

        try {
            IIdType groupCreated = groupController.create(fhirGroup);
            LOG.info("Group created: {}", groupCreated);
        } catch (Exception e){
            groupsResource.group(keycloakGroupId).remove();
        }

        return Response.ok().status(Response.Status.CREATED).build();

    }*/

    private Response getGroupByName(String name) {
        return Response.ok(getRealm().groups().groups(name, 0, 1, false)).build();
    }

    public GroupRepresentation getGroupByName_representation(String name) {
        return getRealm().groups().groups(name, 0, 1, false).get(0);
    }

    public Response updateGroup(org.fhir.auth.irccs.entity.Group group) {

        // FIXME: Enforce unique GroupName
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

        Group fhirGroup = (Group) groupController.search("name=" + group.getName()).getEntry().get(0).getResource();
        Objects.requireNonNull(fhirGroup);
        fhirGroup.setName(group.getName());
        fhirGroup.setMember(practitionerReferences);

        Group groupUpdated = groupController.update(fhirGroup.getIdPart(), fhirGroup);
        LOG.info("Group updated: {}", groupUpdated);

        return Response.ok().status(Response.Status.ACCEPTED).build();

    }

    public Response deleteGroup(String name) {

        GroupsResource groupsResource = getRealm().groups();
        GroupRepresentation foundGroup = groupsResource.query(name).get(0);
        Objects.requireNonNull(foundGroup);
        GroupResource groupResource = groupsResource.group(foundGroup.getId());
        groupResource.remove();

        Group group = (Group) groupController.search("name=" + name).getEntry().get(0).getResource();
        Objects.requireNonNull(group);

        groupController.delete(group.getIdPart());

        return Response.ok().status(Response.Status.OK).build();

    }

}

