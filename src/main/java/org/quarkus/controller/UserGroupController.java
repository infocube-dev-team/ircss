/*
package org.quarkus.controller;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.quarkus.entity.UserGroup;
import org.quarkus.entity.UserGroupCommand;

import java.util.List;

@Path("/groups")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface UserGroupController {

    @GET
    List<UserGroup> getAllUserGroups();

    @GET
    @Path("/{id}")
    UserGroup getUserGroupById(@PathParam("id") Long id);

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    void createUserGroup(UserGroupCommand userGroup);

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    void updateUserGroup(@PathParam("id") Long id, String name);

    @DELETE
    @Path("/{id}")
    void deleteUserGroup(@PathParam("id") Long id);

    @PUT
    @Path("/{id}/add")
    void addUserToGroup(@PathParam("id") Long id, Long userId);

    @PUT
    @Path("/{id}/remove")
    void removeUserFromGroup(@PathParam("id") Long id, Long userId);

}
*/
