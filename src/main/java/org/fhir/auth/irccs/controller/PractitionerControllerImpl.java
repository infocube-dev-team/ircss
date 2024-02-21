package org.fhir.auth.irccs.controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import org.fhir.auth.irccs.service.PractitionerService;
import org.hl7.fhir.r5.model.Practitioner;

public class PractitionerControllerImpl implements PractitionerController {

    @Inject
    PractitionerService PractitionerService;

    public Response getAllPractitioners(UriInfo searchParameters) {
        return PractitionerService.getAllPractitioners(searchParameters);
    }

    public Response getPractitioner(String id) {
        return PractitionerService.getPractitioner(id);
    }
    public Response createPractitioner(Practitioner practitioner) {
        return PractitionerService.createPractitioner(practitioner);
    }

    public Response updatePractitioner(Practitioner practitioner) {
        return PractitionerService.updatePractitioner(practitioner);
    }

    public Response deletePractitioner(UriInfo searchParameters) {
        return PractitionerService.deletePractitioner(searchParameters);
    }

}
