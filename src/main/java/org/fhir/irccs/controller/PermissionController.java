package org.fhir.irccs.controller;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import org.fhir.irccs.entity.PermissionWrapper;
import org.quarkus.irccs.common.constants.FhirConst;


@Path("/fhir/auth/permissions")
@Consumes(FhirConst.FHIR_MEDIA_TYPE)
@Produces(FhirConst.FHIR_MEDIA_TYPE)
public interface PermissionController {

/*    Response getPermission(@QueryParam("name") String name);*/
    @POST
    Response createPermission(PermissionWrapper permissions);
/*    @PUT
    Response updatePermission(PermissionWrapper permissions);*/
}
