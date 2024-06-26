package org.fhir.auth.irccs.controller;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.fhir.auth.irccs.entity.OfficeType;
import org.fhir.auth.irccs.entity.PermissionWrapper;


@Path("/fhir/auth/permissions")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface PermissionController {

    @GET
    Response getPermission(@QueryParam("groupId") String groupId);
    @POST
    Response addRoles(PermissionWrapper permissions);
    @POST
    @Path("/officeType")
    @Consumes("application/json")
    Response setOfficeType(OfficeType officeType);

}
