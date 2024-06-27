package org.fhir.auth.irccs.controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import org.fhir.auth.irccs.entity.OfficeType;
import org.fhir.auth.irccs.entity.PermissionWrapper;
import org.fhir.auth.irccs.service.PermissionService;

public class PermissionControllerImpl implements PermissionController{

    @Inject
    PermissionService permissionService;

    public Response getPermission(String groupId) {
        return permissionService.getPermission(groupId);
    }

    public Response addRoles(PermissionWrapper permissions) {
        return permissionService.addRoles(permissions);
    }

    public Response setOfficeType(OfficeType officeType) {
        return permissionService.setOfficeType(officeType);
    }

    public Response getOfficeType(String groupId) {
        return permissionService.getOfficeType(groupId);
    }

}
