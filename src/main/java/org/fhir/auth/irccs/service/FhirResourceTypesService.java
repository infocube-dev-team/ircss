package org.fhir.auth.irccs.service;


import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import org.hl7.fhir.r5.model.Enumerations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class FhirResourceTypesService {
    private final static Logger LOG = LoggerFactory.getLogger(FhirResourceTypesService.class);


    public List<String> getResouceTypes(){
        return Arrays.stream(Enumerations.ResourceTypeEnum.values()).map(Enumerations.ResourceTypeEnum::getDisplay).filter(Objects::nonNull).toList();
    }

}

