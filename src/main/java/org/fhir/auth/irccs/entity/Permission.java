package org.fhir.auth.irccs.entity;


import java.util.ArrayList;
import java.util.List;



public class Permission {
    private String resource;
    public List<String> permissions = new ArrayList<>();
    public List<String> disabled = new ArrayList<>();

    public void setResource(String resource) {
        this.resource = resource;
    }

    public void setCreate(Boolean create) {
        if(create){
            this.permissions.add("create");
        } else {
            this.disabled.add("create");
        }
    }

    public void setRead(Boolean read) {
        if(read){
            this.permissions.add("read");
        } else {
            this.disabled.add("read");
        }
    }
    public void setUpdate(Boolean update) {
        if(update){
            this.permissions.add("update");
        } else {
            this.disabled.add("update");
        }
    }

    public void setSearch(Boolean search) {
        if(search){
            this.permissions.add("search");
        } else {
            this.disabled.add("search");
        }
    }

    public void setHistory(Boolean history) {
        if(history){
            this.permissions.add("history");
        } else {
            this.disabled.add("history");
        }
    }

    public void setDelete(Boolean delete) {
        if(delete){
            this.permissions.add("delete");
        } else {
            this.disabled.add("delete");
        }
    }

    public List<String> getPermissions() {
        return permissions;
    }

    public String getResource() {
        return resource;
    }

    public List<String> getDisabled() {
        return disabled;
    }
}
