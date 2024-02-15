package org.fhir.irccs.entity;


import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;



public class Permission {
    private String resource;
    public List<String> permissions = new ArrayList<>();

    public void setResource(String resource) {
        this.resource = resource;
    }

    public void setCreate(Boolean create) {
        if(create){
            this.permissions.add("create");
        }
    }

    public void setRead(Boolean read) {
        if(read){
            this.permissions.add("read");
        }
    }
    public void setUpdate(Boolean update) {
        if(update){
            this.permissions.add("update");
        }
    }

    public void setSearch(Boolean search) {
        if(search){
            this.permissions.add("search");
        }
    }

    public void setHistory(Boolean history) {
        if(history){
            this.permissions.add("history");
        }
    }

    public void setDelete(Boolean delete) {
        if(delete){
            this.permissions.add("delete");
        }
    }

    public List<String> getPermissions() {
        return permissions;
    }

    public String getResource() {
        return resource;
    }
}
