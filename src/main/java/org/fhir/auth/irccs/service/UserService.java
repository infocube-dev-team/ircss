package org.fhir.auth.irccs.service;


import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.fhir.auth.irccs.exceptions.OperationException;
import org.fhir.auth.irccs.entity.User;
import org.hl7.fhir.instance.model.api.IIdType;
import org.hl7.fhir.r5.model.*;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.quarkus.irccs.client.restclient.FhirClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@ApplicationScoped
public class UserService {
    private final static Logger LOG = LoggerFactory.getLogger(UserService.class);
    @Inject
    Keycloak keycloak;
    @Inject
    FhirClient<Practitioner> practitionerController;
    @ConfigProperty(name = "quarkus.keycloak.admin-client.realm")
    String realm;


    private RealmResource getRealm(){return keycloak.realm(realm);}

    public Response getAllUsers(String email) {
        if(email.isEmpty()) return Response.ok(getRealm().users().list()).build();
        return Response.ok(getUserByEmail_keycloak(email)).build();
    }

    public Response createUser(User user) {
        // Creating Keycloak User Representation

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
    }

    public Response enableUser(String email) {
        LOG.info("Enabling user {}...", email);

        UserRepresentation user;
        try {
            user = getUserByEmail_keycloak(email);
            Objects.requireNonNull(user);
            user.setEnabled(true);
            getRealm().users().get(user.getId()).update(user);
        } catch (Exception e){
            LOG.error("ERROR: Couldn't get nor enable Keycloak User: {}", email);
            e.printStackTrace();
            return Response.status(Response.Status.EXPECTATION_FAILED).build();
        }



        // Creating Fhir Practitioner Resource
        IIdType practitionerId;
        Practitioner practitioner = new Practitioner();
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

        return Response.ok(practitionerController.encodeResourceToString(practitionerController.read(practitionerId))).build();

    }

    public UserRepresentation getUserByEmail_keycloak(String email) throws OperationException {
        try{
            return getRealm().users().search(email).get(0);
        } catch (Exception e){
            LOG.error("ERROR: Couldn't find Keycloak user: {}", email);
            e.printStackTrace();
            throw new OperationException("Couldn't find Keycloak user", OperationOutcome.IssueSeverity.ERROR);
        }
    }

    public Practitioner getUserByEmail_fhir(String email) throws OperationException {
        try{
            return (Practitioner) practitionerController.search("email=" + email).getEntry().get(0).getResource();
        } catch (Exception e){
            LOG.info(practitionerController.encodeResourceToString(practitionerController.search("email=" + email).getEntry().get(0).getResource()));
            LOG.error("ERROR: Couldn't find FHIR practitioner: {}", email);
            e.printStackTrace();
            throw new OperationException("Couldn't find FHIR practitioner", OperationOutcome.IssueSeverity.ERROR);
        }
    }

    public Response updateUser(User user) {

        UsersResource usersResource = getRealm().users();
        UserRepresentation userRepresentation;
        String userId;

        try {
            userRepresentation = usersResource.search(user.getEmail()).get(0);
            userId = userRepresentation.getId();
            Objects.requireNonNull(userId);
        } catch (Exception e){
            LOG.error("ERROR: Couldn't find Keycloak user: {}.", user.getEmail());
            e.printStackTrace();
            return Response.status(Response.Status.EXPECTATION_FAILED).build();
        }

        userRepresentation.setEmailVerified(true);
        userRepresentation.setFirstName(user.getName());
        userRepresentation.setLastName(user.getSurname());
        userRepresentation.setAttributes(new HashMap<>(){{
            put("organizationRequest", user.getOrganizationRequest());
            put("phoneNumber", List.of(user.getPhoneNumber()));
        }});


        CredentialRepresentation credentialPassword = new CredentialRepresentation();
        credentialPassword.setTemporary(false);
        credentialPassword.setType(CredentialRepresentation.PASSWORD);
        credentialPassword.setValue(user.getPassword());

        UserResource userResource;

        try{
            userResource = usersResource.get(userId);
            userResource.resetPassword(credentialPassword);
            userResource.update(userRepresentation);
        } catch (Exception e){
            LOG.error("ERROR: Couldn't retrieve nor update Keycloak user: {}.", user.getEmail());
            e.printStackTrace();
            return Response.status(Response.Status.EXPECTATION_FAILED).build();
        }

        // Updating Fhir Practitioner Resource
        Practitioner practitioner;
        try {
            practitioner = getUserByEmail_fhir(user.getEmail());
            Objects.requireNonNull(practitioner);
        } catch (Exception e){
            LOG.error("ERROR: Couldn't retrieve FHIR Practitioner: {}.", user.getEmail());
            e.printStackTrace();
            return Response.status(Response.Status.EXPECTATION_FAILED).build();
        }
        practitioner.setName(List.of(new HumanName().setText(user.getName()).setFamily(user.getSurname()).setUse(HumanName.NameUse.OFFICIAL).setGiven(List.of(new StringType(user.getName() + " " + user.getSurname())))));
        practitioner.setTelecom(List.of(new ContactPoint().setSystem(ContactPoint.ContactPointSystem.EMAIL).setUse(ContactPoint.ContactPointUse.WORK).setValue(user.getEmail()), new ContactPoint().setSystem(ContactPoint.ContactPointSystem.PHONE).setUse(ContactPoint.ContactPointUse.WORK).setValue(user.getPhoneNumber())));

        String practitionerUpdated = practitionerController.encodeResourceToString(practitionerController.update(practitioner.getId(), practitioner));
        LOG.info("Practitioner updated: {}", practitionerUpdated);

        return Response.ok(practitionerUpdated).status(Response.Status.ACCEPTED).build();
    }

    @Transactional
    public Response deleteUser(String email) {

        UserResource userResource;
        try{
            UsersResource usersResource = getRealm().users();
            UserRepresentation userRepresentation = getUserByEmail_keycloak(email);
            Objects.requireNonNull(userRepresentation);
            String userId = userRepresentation.getId();
            userResource = usersResource.get(userId);
        } catch (Exception e){
            LOG.error("ERROR: Couldn't retrieve Keycloak User: {}.", email);
            e.printStackTrace();
            return Response.status(Response.Status.EXPECTATION_FAILED).build();
        }

        if(userResource.toRepresentation().isEnabled()) {
            Practitioner practitioner;
            try {
                practitioner = getUserByEmail_fhir(email);
                Objects.requireNonNull(practitioner);
            } catch (Exception e) {
                LOG.error("ERROR: Couldn't retrieve FHIR Practitioner: {}.", email);
                e.printStackTrace();
                return Response.status(Response.Status.EXPECTATION_FAILED).build();
            }

            try {
                practitionerController.delete(practitioner.getIdPart());
            } catch (Exception e) {
                LOG.error("ERROR: Couldn't remove FHIR Practitioner: {}.", email);
                e.printStackTrace();
                return Response.status(Response.Status.EXPECTATION_FAILED).build();
            }
        }

        try {
            userResource.remove();
        } catch (Exception e){
            LOG.error("ERROR: Couldn't remove Keycloak User: {}.", email);
            e.printStackTrace();
            return Response.status(Response.Status.EXPECTATION_FAILED).build();
        }

        return Response.ok().status(Response.Status.OK).build();
    }

    public void joinGroup(String email, GroupRepresentation group){
        getRealm().users().get(getUserByEmail_keycloak(email).getId()).joinGroup(group.getId());
    }

    public void leaveGroup(String email, GroupRepresentation group){
        System.out.println(group.getName());
        getRealm().users().get(getUserByEmail_keycloak(email).getId()).leaveGroup(group.getId());
    }

}

