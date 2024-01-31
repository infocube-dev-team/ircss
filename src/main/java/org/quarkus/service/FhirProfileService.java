/*
package org.quarkus.service;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import org.keycloak.KeycloakPrincipal;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.quarkus.controller.FhirProfileController;
import org.quarkus.entity.FhirProfile;
import org.quarkus.entity.ResourceType;
import java.util.ArrayList;
import java.util.List;

public class FhirProfileService implements FhirProfileController {

    public static List<FhirProfile> fhirProfiles = new ArrayList<>();

    @Inject
    SecurityIdentity securityIdentity;

    public List<FhirProfile> getAllFhirProfiles() {
        return fhirProfiles;
    }

    public FhirProfile getFhirProfileById(Long id) {
        return fhirProfiles.stream().filter(profile -> profile.getId().equals(id)).findFirst().orElse(null);
    }

    public void createFhirProfile(List<ResourceType> resourceTypes) {
        fhirProfiles.add(new FhirProfile(resourceTypes));
    }

    public void updateFhirProfile(Long id, List<ResourceType> resourceTypes) {
        FhirProfile findProfile = getFhirProfileById(id);
        findProfile.setResourceTypes(resourceTypes);
        System.out.println("prova");
        int index = fhirProfiles.indexOf(findProfile);
        fhirProfiles.set(index, new FhirProfile(findProfile.getId(), resourceTypes));
    }

    public void deleteFhirProfile(Long id) {
        fhirProfiles.removeIf(profile -> profile.getId().equals(id));
    }
}
*/
