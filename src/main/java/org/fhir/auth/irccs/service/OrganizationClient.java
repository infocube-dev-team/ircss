package org.fhir.auth.irccs.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.*;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.quarkus.irccs.common.constants.FhirConst;

@ApplicationScoped
@Path("/fhir/Organization")
@RegisterRestClient(configKey="organization-microservice-client")
@Consumes(FhirConst.FHIR_MEDIA_TYPE)
@Produces(FhirConst.FHIR_MEDIA_TYPE)
public interface OrganizationClient {
    @GET
    String getOrganizations(@HeaderParam("Authorization") String jwtToken, @QueryParam("_count") Integer count, @QueryParam("_offset") Integer offset );
}