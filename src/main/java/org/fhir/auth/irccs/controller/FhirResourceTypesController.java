package org.fhir.auth.irccs.controller;

import io.quarkus.security.Authenticated;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;


@Path("/fhir/auth/resourceTypes")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public interface FhirResourceTypesController {

    @GET
    List<String> getResouceTypes();

}
