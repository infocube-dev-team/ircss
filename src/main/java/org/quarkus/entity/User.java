package org.quarkus.entity;


import java.util.Objects;

import org.hl7.fhir.r5.model.Practitioner;

import lombok.Getter;


public class User {
    private final Practitioner practitioner;
    @Getter
    private final String password;

    public Practitioner getPractioner() {
        return practitioner;
    }

    public User(Practitioner practitioner, String password) {
        Objects.requireNonNull(practitioner);
        Objects.requireNonNull(password);
        this.password = password;
        this.practitioner = practitioner;

    }
}
