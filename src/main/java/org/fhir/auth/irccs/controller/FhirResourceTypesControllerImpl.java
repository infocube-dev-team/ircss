package org.fhir.auth.irccs.controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.fhir.auth.irccs.entity.Group;
import org.fhir.auth.irccs.service.FhirResourceTypesService;
import org.fhir.auth.irccs.service.GroupService;

import java.util.List;

public class FhirResourceTypesControllerImpl implements FhirResourceTypesController {

    @Inject
    FhirResourceTypesService fhirResourceTypesService;

    @Override
    public List<String> getResouceTypes() {
        return fhirResourceTypesService.getResouceTypes();
    }
}
