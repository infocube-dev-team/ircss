package org.fhir.auth.irccs.service;


import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.fhir.auth.irccs.exceptions.OperationException;
import org.hl7.fhir.instance.model.api.IIdType;
import org.hl7.fhir.r5.model.Enumerations;
import org.hl7.fhir.r5.model.Group;
import org.hl7.fhir.r5.model.OperationOutcome;
import org.hl7.fhir.r5.model.Reference;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.GroupResource;
import org.keycloak.admin.client.resource.GroupsResource;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.quarkus.irccs.client.restclient.FhirClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@ApplicationScoped
public class FhirResourceTypesService {
    private final static Logger LOG = LoggerFactory.getLogger(FhirResourceTypesService.class);


    public List<String> getResouceTypes(){
        return Arrays.stream(Enumerations.ResourceTypeEnum.values()).map(Enumerations.ResourceTypeEnum::getDisplay).filter(Objects::nonNull).toList();
    }

}

