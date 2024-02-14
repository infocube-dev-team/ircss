package org.fhir.auth.entity;


import java.util.List;
import java.util.Objects;

import jakarta.inject.Inject;
import lombok.Setter;
import org.hl7.fhir.r5.model.Practitioner;

import lombok.Getter;
import org.quarkus.irccs.client.restclient.FhirClient;


@Getter @Setter
public class User {
    private String name;
    private String surname;
    private String email;
    private String password;
    private String phoneNumber;
    private List<String> organizationRequest;
}
