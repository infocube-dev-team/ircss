package org.fhir.auth.irccs.entity;


import org.fhir.auth.irccs.service.GroupService;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.RealmRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


public class Group {

    private String id;
    private String name;
    private List<String> members;
    private List<String> organizations;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getMembers() {
        return members;
    }

    public void setMembers(List<String> members) {
        this.members = members;
    }

    public List<String> getOrganizations() {
        return organizations;
    }

    public void setOrganizations(List<String> organizations) {
        this.organizations = organizations;
    }

    public static Group fromGroupRepresentation(GroupRepresentation groupRepresentation, RealmResource realmResource){
        Group group = new Group();
        group.setId(groupRepresentation.getId());
        group.setName(groupRepresentation.getName());
        group.setMembers(realmResource.groups().group(groupRepresentation.getId()).members()
                .stream()
                .map(UserRepresentation::getEmail)
                .collect(Collectors.toList()));

        Map<String, List<String>> attributes = groupRepresentation.getAttributes();
        if (attributes != null && attributes.get("organizations") != null) {
            group.setOrganizations(attributes.get("organizations"));
        }
        return group;
    }

}
