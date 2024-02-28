package org.fhir.auth.irccs.controller;

import io.quarkus.security.Authenticated;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.fhir.auth.irccs.entity.User;


@Path("/fhir/auth/users")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public interface UserController {

    @GET
    Response getAllUsers(@QueryParam("email") @DefaultValue("") String email);

    @Path("/signup")
    @POST
    Response createUser(User user);
    @Path("/enable")
    @POST
    Response enableUser(@QueryParam("email") @DefaultValue("") String email);
    @PUT
    Response updateUser(User user);

    @DELETE
    Response deleteUser(@QueryParam("email") String email);
}
