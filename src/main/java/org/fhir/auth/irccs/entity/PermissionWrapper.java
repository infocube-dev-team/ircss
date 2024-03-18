package org.fhir.auth.irccs.entity;


import java.util.ArrayList;
import java.util.List;


public class PermissionWrapper {
    private String groupId;
    private String groupName;
    private List<Permission> permissions;

    public String getGroupName() {
        return groupName;
    }
    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }
    public List<Permission> getPermissions() {
        return permissions;
    }
    public void setPermissions(List<Permission> permissions) {
        this.permissions = permissions;
    }
    public String getGroupId() {
        return groupId;
    }
    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public static PermissionWrapper toPermissionWrapper(String groupId, String groupName, List<String> roles){
        PermissionWrapper permissionWrapper = new PermissionWrapper();
        permissionWrapper.setGroupId(groupId);
        permissionWrapper.setGroupName(groupName);
        List<Permission> permission = new ArrayList<>();
        roles.forEach(role -> {
            String[] splitRole = role.split(":");
            Permission mapPermission = new Permission();
            if(splitRole.length == 2){
                mapPermission.setResource(splitRole[0]);
                mapPermission.setRead(roles.contains(splitRole[0]+":read"));
                mapPermission.setCreate(roles.contains(splitRole[0]+":create"));
                mapPermission.setUpdate(roles.contains(splitRole[0]+":update"));
                mapPermission.setDelete(roles.contains(splitRole[0]+":delete"));
                mapPermission.setSearch(roles.contains(splitRole[0]+":search"));
                mapPermission.setHistory(roles.contains(splitRole[0]+":history"));
                permission.add(mapPermission);
            }
        });
        permissionWrapper.setPermissions(permission);
        return permissionWrapper;
    }

}
