package org.fhir.auth.irccs.controller;

import io.quarkus.security.Authenticated;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import org.hl7.fhir.r5.model.Practitioner;


@Path("/fhir/auth/practitioner")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public interface PractitionerController {

    @GET
    @Path("/id")
    Response getPractitioner(@PathParam("id") String id);

    @POST
    Response createPractitioner(Practitioner practitioner);

    @PUT
    Response updatePractitioner(Practitioner practitioner);

    @DELETE
    Response deletePractitioner(@Context UriInfo searchParameters);

    @GET
    Response getAllPractitioners(@Context UriInfo searchParameters);
}
