package org.fhir.auth.irccs.entity;


import java.util.List;


public class PermissionWrapper {
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
}
