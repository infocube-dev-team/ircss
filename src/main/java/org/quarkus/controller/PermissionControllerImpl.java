package org.quarkus.controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.quarkus.entity.PermissionWrapper;
import org.quarkus.entity.User;
import org.quarkus.service.PermissionService;
import org.quarkus.service.UserService;

public class PermissionControllerImpl implements PermissionController{

   /* @Inject
    PermissionService permissionService;

    public Response getPermission(String name) {
        return permissionService.getPermission(name);
    }

    public Response createPermission(PermissionWrapper permissions) {
        return permissionService.createPermission(permissions);
    }

    public Response updatePermission(PermissionWrapper permissions) {
        return permissionService.createPermission(permissions);
    }*/
}
