package org.fhir.auth.irccs.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.quarkus.irccs.annotations.models.User;
import org.quarkus.irccs.common.constants.FhirConst;

@ApplicationScoped
@Path("/fhir/Practitioner")
@RegisterRestClient(configKey="practitioner-microservice-client")
@Consumes(FhirConst.FHIR_MEDIA_TYPE)
@Produces(FhirConst.FHIR_MEDIA_TYPE)
public interface PractitionerClient {

    @POST
    String createUser(@HeaderParam("Authorization") String jwtToken, String practitioner);

}