package org.fhir.auth.irccs.controller;

import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.fhir.auth.irccs.entity.Group;
import org.fhir.auth.irccs.service.FhirResourceTypesService;

import java.util.List;


@Path("/fhir/auth/resourceTypes")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public interface FhirResourceTypesController {

    @GET
    List<String> getResouceTypes();

}
