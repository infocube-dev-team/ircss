package org.fhir.auth.irccs.controller;

import jakarta.inject.Inject;
import org.fhir.auth.irccs.service.FhirResourceTypesService;

import java.util.List;

public class FhirResourceTypesControllerImpl implements FhirResourceTypesController {

    @Inject
    FhirResourceTypesService fhirResourceTypesService;

    @Override
    public List<String> getResouceTypes() {
        return fhirResourceTypesService.getResouceTypes();
    }
}
