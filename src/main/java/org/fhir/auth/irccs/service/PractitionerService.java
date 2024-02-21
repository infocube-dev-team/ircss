package org.fhir.auth.irccs.service;


import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.hl7.fhir.instance.model.api.IIdType;
import org.hl7.fhir.r5.model.*;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.quarkus.irccs.client.restclient.FhirClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@ApplicationScoped
public class PractitionerService {
    private final static Logger LOG = LoggerFactory.getLogger(PractitionerService.class);
    @Inject
    Keycloak keycloak;
    @Inject
    FhirClient<Practitioner> practitionerController;

    @Inject
    UserService userService;

    @ConfigProperty(name = "quarkus.keycloak.admin-client.realm")
    String realm;

    private RealmResource getRealm(){return keycloak.realm(realm);}

    public Response getAllPractitioners(UriInfo searchParameters) {
        String queryParams = practitionerController.convertToQueryString(searchParameters.getQueryParameters());
        return Response.ok().status(Response.Status.CREATED.getStatusCode(),
                practitionerController.encodeResourceToString(practitionerController.readAll(queryParams))).build();
    }

    public Response getPractitioner(String id) {
        return Response.ok().status(Response.Status.CREATED.getStatusCode(),
                practitionerController.encodeResourceToString(practitionerController
                        .read(new IdType(practitionerController.getResourceType().getSimpleName(), id)))
                ).build();
    }

    public Response createPractitioner(Practitioner user) {
        /*
        // Creating Fhir Practitioner Resource
        practitioner.setName(List.of(new HumanName().setText(user.getFirstName()).setFamily(user.getLastName()).setUse(HumanName.NameUse.OFFICIAL).setGiven(List.of(new StringType(user.getFirstName() + " " + user.getLastName())))));
        practitioner.setTelecom(List.of(new ContactPoint().setSystem(ContactPoint.ContactPointSystem.EMAIL).setUse(ContactPoint.ContactPointUse.WORK).setValue(user.getEmail()), new ContactPoint().setSystem(ContactPoint.ContactPointSystem.PHONE).setUse(ContactPoint.ContactPointUse.WORK).setValue(user.getAttributes().get("phoneNumber").get(0))));
        practitioner.setIdentifier(List.of(new Identifier().setUse(Identifier.IdentifierUse.SECONDARY).setValue(user.getId())));
        try{
            LOG.info("Creating Fhir Practitioner {}...", user.getEmail() + " " + user.getLastName());
            practitionerId = practitionerController.create(practitioner);
            Objects.requireNonNull(practitionerId);
        } catch (Exception e){
            user.setEnabled(false);
            getRealm().users().get(user.getId()).update(user);
            LOG.error("ERROR: Couldn't create Fhir Practitioner: {}.\nDisabled Keyclock User Again.", user.getFirstName() + " " + user.getLastName());
            e.printStackTrace();
            return Response.status(Response.Status.EXPECTATION_FAILED).build();
        }

        LOG.info("Practitioner Successfully created with ID {} and Keycloak User Identifier: {} ", practitionerId, user.getId());
        LOG.info("Creating Keycloak User: {}", user.getEmail());
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setUsername(user.getEmail());
        userRepresentation.setEmail(user.getEmail());
        userRepresentation.setEmailVerified(true);
        userRepresentation.setEnabled(false);
        userRepresentation.setFirstName(user.getName());
        userRepresentation.setLastName(user.getSurname());
        userRepresentation.setAttributes(new HashMap<>(){{
            put("organizationRequest", user.getOrganizationRequest());
            put("phoneNumber", List.of(user.getPhoneNumber()));
        }});

        String userId;
        UsersResource usersResource;
        try {
            usersResource = getRealm()
                    .users();
            Response response = usersResource
                    .create(userRepresentation);
            userId = CreatedResponseUtil.getCreatedId(response);
            Objects.requireNonNull(userId);
        } catch (Exception e){
            e.printStackTrace();
            LOG.error("ERROR: Couldn't create user {}", userRepresentation.getEmail());
            return Response.status(Response.Status.EXPECTATION_FAILED).build();
        }

        // Setting Keycloak's User Password

        LOG.info("Keycloak User created: {}.\nSetting password...", user.getEmail());

        CredentialRepresentation credentialPassword = new CredentialRepresentation();
        credentialPassword.setTemporary(false);
        credentialPassword.setType(CredentialRepresentation.PASSWORD);
        credentialPassword.setValue(user.getPassword());

        try {
            UserResource userResource = usersResource.get(userId);
            Objects.requireNonNull(userResource);
            userResource.resetPassword(credentialPassword);
        } catch (Exception e){
            e.printStackTrace();
            Response response = usersResource.delete(userId);
            response.close();
            LOG.error("ERROR: Couldn't set user's password {}.\nDeleting User...", userRepresentation.getEmail());
            return Response.status(Response.Status.EXPECTATION_FAILED).build();
        }

        return Response.ok(getUserByEmail_keycloak(user.getEmail())).build();
        */
        return null;
    }

    public Response updatePractitioner(Practitioner practitioner) {
        return null;
    }

    public Response deletePractitioner(UriInfo searchParameters) {
        return null;
    }

}

