package org.fhir.auth.irccs.entity;


import java.util.ArrayList;


public class Permission {
    public String resource;
    public boolean read;
    public boolean create;
    public boolean update;
    public boolean history;
    public boolean delete;
    public boolean search;


    public String getResource() {
        return resource;
    }

    public void setResource(String resource) {
        this.resource = resource;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public boolean isCreate() {
        return create;
    }

    public void setCreate(boolean create) {
        this.create = create;
    }

    public boolean isUpdate() {
        return update;
    }

    public void setUpdate(boolean update) {
        this.update = update;
    }

    public boolean isHistory() {
        return history;
    }

    public void setHistory(boolean history) {
        this.history = history;
    }

    public boolean isDelete() {
        return delete;
    }

    public void setDelete(boolean delete) {
        this.delete = delete;
    }

    public boolean isSearch() {
        return search;
    }

    public void setSearch(boolean search) {
        this.search = search;
    }

    public ArrayList<String> calcTruePermissions() {
        ArrayList<String> truePermissions = new ArrayList<>();
        if (read) truePermissions.add("read");
        if (create) truePermissions.add("create");
        if (update) truePermissions.add("update");
        if (history) truePermissions.add("history");
        if (delete) truePermissions.add("delete");
        if (search) truePermissions.add("search");
        return truePermissions;
    }
}
