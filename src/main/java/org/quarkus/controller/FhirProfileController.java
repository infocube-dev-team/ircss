package org.quarkus.controller;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.quarkus.entity.FhirProfile;
import org.quarkus.entity.ResourceType;

import java.util.List;

@Path("/profiles")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface FhirProfileController {

    @GET
    List<FhirProfile> getAllFhirProfiles();

    @GET
    @Path("/{id}")
    FhirProfile getFhirProfileById(@PathParam("id") Long id);

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    void createFhirProfile(List<ResourceType> resourceTypes);

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    void updateFhirProfile(@PathParam("id") Long id, List<ResourceType> resourceTypes);

    @DELETE
    @Path("/{id}")
    void deleteFhirProfile(@PathParam("id") Long id);
}