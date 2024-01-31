package org.quarkus.controller;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.quarkus.entity.FhirProfile;
import org.quarkus.entity.ResourceType;

import java.util.List;

@Path("/auth")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface AuthController {

    @GET
    Response createUser();
}