package org.fhir.auth.irccs.entity;


import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.fhir.auth.irccs.service.GroupService;
import org.jboss.resteasy.reactive.ClientWebApplicationException;
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
    private String parentGroupId;
    private String organizationId;
    private Boolean isOrganization;
    private String groupId;
    private Boolean isDataManager = false;
    private Boolean isOrgAdmin = false;

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

    public String getParentGroupId() {
        return parentGroupId;
    }

    public void setParentGroupId(String parentGroupId) {
        this.parentGroupId = parentGroupId;
    }

    public String getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public Boolean getOrganization() {
        return isOrganization;
    }

    public void setOrganization(Boolean organization) {
        isOrganization = organization;
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

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public Boolean getDataManager() {
        return isDataManager;
    }

    public void setDataManager(Boolean dataManager) {
        isDataManager = dataManager;
    }

    public Boolean getOrgAdmin() {
        return isOrgAdmin;
    }

    public void setOrgAdmin(Boolean orgAdmin) {
        isOrgAdmin = orgAdmin;
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

    public static GroupRepresentation toGroupRepresentation(Group group, RealmResource realm, String parentGroupId){

        GroupRepresentation groupRepresentation = new GroupRepresentation();
        String createdId = group.getId();
        Map<String, List<String>> attributes = new HashMap<>();

        if(groupRepresentation.getAttributes() != null){
            attributes = groupRepresentation.getAttributes();
        }

        if(null != group.getName()){
            groupRepresentation.setName(group.getName());
        }
        if(group.isOrganization){
            if(group.getOrganizationId() != null){
                attributes.put("organizationId", List.of(group.getOrganizationId()));;
            } else {
                throw new ClientWebApplicationException("Tried to create a group with no organization id", Response.Status.BAD_REQUEST);
            }
        }

        if(!group.getGroupId().isEmpty()){
            attributes.put("groupId", List.of(group.getGroupId()));;
        }

        attributes.put("isOrganization", List.of(group.getOrganization().toString()));
        if(group.getOrganizations() != null && !group.getOrganizations().isEmpty()){
            attributes.put("organizations", group.getOrganizations());
        }
        groupRepresentation.setAttributes(attributes);

        if(null != createdId){
            groupRepresentation.setId(group.getId());
            List<UserRepresentation> users = realm.groups().group(group.getId()).members();
            users.forEach(member -> realm.users().get(member.getId()).leaveGroup(group.getId()) );
        } else {
            if(parentGroupId != null && !parentGroupId.isEmpty()){
                createdId = CreatedResponseUtil.getCreatedId(realm.groups().group(parentGroupId).subGroup(groupRepresentation));
                realm.groups().group(createdId).roles().realmLevel().remove(realm.groups().group(parentGroupId).roles().realmLevel().listEffective());
            } else {
                createdId = CreatedResponseUtil.getCreatedId(realm.groups().add(groupRepresentation));
            }
        }
        if(group.getMembers() != null && !group.getMembers().isEmpty()){
            String finalCreatedId = createdId;
            group.getMembers().forEach(member -> realm.users().get(member).joinGroup(finalCreatedId) );
        }
        groupRepresentation.setId(createdId);

        return groupRepresentation;
    }

}
