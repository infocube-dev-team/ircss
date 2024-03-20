package org.fhir.auth.irccs.controller;

import io.quarkus.security.Authenticated;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.fhir.auth.irccs.entity.User;

import java.util.HashMap;


@Path("/fhir/auth/users")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public interface UserController {

    @GET
    Response getAllUsers(@QueryParam("email") @DefaultValue("") String email);
    @Path("/signup")
    @POST
    Response signUp(User user);

    @Path("/create")
    @POST
    Response createUser(User user);

    @Path("/token")
    @Consumes("application/x-www-form-urlencoded")
    @POST
    Response tokenExchange(String payload);
    @Path("/logout")
    @Consumes("application/x-www-form-urlencoded")
    @POST
    Response logout(String payload);
    @Path("/enable")
    @POST
    Response enableUser(@QueryParam("email") @DefaultValue("") String email);
    @PUT
    Response updateUser(User user);

    @DELETE
    Response deleteUser(@QueryParam("email") String email);

    @Path("/forgotPassword")
    @Consumes("application/json")
    @POST
    Response forgotPassword(HashMap<String,String> payload);

    @Path("/updatePassword")
    @Consumes("application/json")
    @PUT
    Response updatePassword(HashMap<String,String>  payload);
}

