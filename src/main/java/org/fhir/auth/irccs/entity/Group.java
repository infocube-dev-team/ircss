package org.fhir.auth.irccs.entity;


import org.fhir.auth.irccs.service.GroupService;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.List;
import java.util.stream.Collectors;


public class Group {

    static GroupService groupService;

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

    public static Group fromGroupRepresentation(GroupRepresentation groupRepresentation){
        Group group = new Group();
        group.setId(groupRepresentation.getId());
        group.setName(groupRepresentation.getName());
        group.setMembers(groupService.getRealm().groups().group(groupRepresentation.getId()).members()
                .stream()
                .map(UserRepresentation::getEmail)
                .collect(Collectors.toList()));
        group.setOrganizations(groupRepresentation.getAttributes().get("organizations"));
        return group;
    }

}
