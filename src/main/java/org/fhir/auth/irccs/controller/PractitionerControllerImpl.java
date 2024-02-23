package org.fhir.auth.irccs.controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import org.fhir.auth.irccs.service.PractitionerService;
import org.hl7.fhir.r5.model.Practitioner;

public class PractitionerControllerImpl implements PractitionerController {

    @Inject
    PractitionerService practitionerService;

    public Response getAllPractitioners(UriInfo searchParameters) {
        return practitionerService.getAllPractitioners(searchParameters);
    }

    public Response getPractitioner(String id) {
        return practitionerService.getPractitioner(id);
    }
    public Response createPractitioner(Practitioner practitioner) {
        return practitionerService.createPractitioner(practitioner);
    }

    public Response updatePractitioner(Practitioner practitioner) {
        return practitionerService.updatePractitioner(practitioner);
    }

    public Response deletePractitioner(UriInfo searchParameters) {
        return practitionerService.deletePractitioner(searchParameters);
    }

}
