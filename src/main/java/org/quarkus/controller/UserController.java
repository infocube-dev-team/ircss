package org.quarkus.controller;

import org.quarkus.entity.User;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/users")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface UserController {
    @GET
    Response getAllUsers();

    @POST
    @Path("/create")
    Response createUser(User user);

    @POST
    @Path("/group")
    Response createGroup(String x);

    @GET
    @Path("/{id}")
    Response getUserById(@PathParam("id") String id);

    @PUT
    @Path("/{id}")
    void updateUser(@PathParam("id") Long id, User user);

    @DELETE
    @Path("/{id}")
    void deleteUser(@PathParam("id") Long id);
}
