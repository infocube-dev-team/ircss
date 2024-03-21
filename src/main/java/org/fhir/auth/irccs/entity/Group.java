package org.fhir.auth.irccs.entity;


import jakarta.inject.Inject;
import org.fhir.auth.irccs.service.GroupService;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.RealmRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


public class Group {

    @Inject
    Keycloak keycloak;
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

    public static GroupRepresentation toGroupRepresentation(Group group, RealmResource realm){

        GroupRepresentation groupRepresentation = new GroupRepresentation();
        String createdId = group.getId();

        if(null != group.getName()){
            groupRepresentation.setName(group.getName());
        }
        if(null != createdId){
            groupRepresentation.setId(group.getId());
            List<UserRepresentation> users = realm.groups().group(group.getId()).members();
            users.forEach(member -> realm.users().get(member.getId()).leaveGroup(group.getId()) );
        } else {
            createdId = CreatedResponseUtil.getCreatedId(realm.groups().add(groupRepresentation));
        }
        if(group.getMembers().size() > 0){
            String finalCreatedId = createdId;
            group.getMembers().forEach(member -> realm.users().get(member).joinGroup(finalCreatedId) );
        }
        if(group.getOrganizations().size() > 0){
            groupRepresentation.setAttributes(new HashMap<>(){{
                put("organizations", group.getOrganizations());
            }});
        } else {
            groupRepresentation.setAttributes(new HashMap<>());
        }
        groupRepresentation.setId(createdId);

        return groupRepresentation;
    }

}
