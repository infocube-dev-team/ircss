package org.fhir.auth.controller;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import org.fhir.auth.entity.Group;
import org.quarkus.irccs.common.constants.FhirConst;


@Path("/fhir/auth/groups")
@Consumes(FhirConst.FHIR_MEDIA_TYPE)
@Produces(FhirConst.FHIR_MEDIA_TYPE)
public interface GroupController {

    @GET
    Response getAllGroups(@QueryParam("name") @DefaultValue("") String name);

    @POST
    Response createGroup(Group group);

    @PUT
    Response updateGroup(Group group);

    @DELETE
    Response deleteGroup(@QueryParam("name") String name);
}
