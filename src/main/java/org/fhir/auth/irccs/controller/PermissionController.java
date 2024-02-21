package org.fhir.auth.irccs.controller;

import io.quarkus.security.Authenticated;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.fhir.auth.irccs.entity.PermissionWrapper;


@Path("/fhir/auth/permissions")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public interface PermissionController {

/*    Response getPermission(@QueryParam("name") String name);*/
    @POST
    Response createPermission(PermissionWrapper permissions);
/*    @PUT
    Response updatePermission(PermissionWrapper permissions);*/
}
