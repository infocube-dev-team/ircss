package org.fhir.auth.controller;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import org.fhir.auth.entity.User;
import org.quarkus.irccs.common.constants.FhirConst;


@Path("/fhir/auth/users")
@Consumes(FhirConst.FHIR_MEDIA_TYPE)
@Produces(FhirConst.FHIR_MEDIA_TYPE)
public interface UserController {

    @GET
    Response getAllUsers(@QueryParam("email") @DefaultValue("") String email);

    @POST
    Response createUser(User user);

    @PUT
    Response updateUser(User user);

    @DELETE
    Response deleteUser(@QueryParam("email") String email);
}
