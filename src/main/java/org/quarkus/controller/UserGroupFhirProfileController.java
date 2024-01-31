package org.quarkus.controller;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.quarkus.entity.FhirProfile;

@Path("/groups")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface UserGroupFhirProfileController {

    @POST
    @Path("/{groupId}/profiles/{profileId}")
    void associateFhirProfileWithUserGroup(@PathParam("groupId") Long groupId, @PathParam("profileId") Long profileId);

    @DELETE
    @Path("/{groupId}/profiles/{profileId}")
    void dissociateFhirProfileFromUserGroup(@PathParam("groupId") Long groupId, @PathParam("profileId") Long profileId);

    @GET
    @Path("/{userId}/profiles")
    FhirProfile getComputedFhirProfileForUser(@PathParam("userId") Long userId);

}
