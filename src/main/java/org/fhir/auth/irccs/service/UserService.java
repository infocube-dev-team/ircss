package org.fhir.auth.irccs.service;


import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.fhir.auth.irccs.RollbackSystem.Command;
import org.fhir.auth.irccs.RollbackSystem.RollbackManager;
import org.fhir.auth.irccs.entity.User;
import org.fhir.auth.irccs.exceptions.OperationException;
import org.hl7.fhir.r5.model.OperationOutcome;
import org.hl7.fhir.r5.model.Practitioner;
import org.jboss.resteasy.reactive.RestResponse;
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


    private RealmResource getRealm() {
        return keycloak.realm(realm);
    }

    public Response getAllUsers(String email) {
        if (email.isEmpty())
            return Response.ok(getRealm()
                            .users()
                            .list()
                            .stream()
                            .map(User::fromUserRepresentation)
                            .toList())
                    .build();

        return Response.ok(User.fromUserRepresentation(getUserByEmail_keycloak(email))).build();
    }

    public Response enableUser(String email) {
        RollbackManager rollbackManager = new RollbackManager();

        User user = User.fromUserRepresentation(getUserByEmail_keycloak(email));
        rollbackManager.addCommand(new Command(
                () -> enableKeycloakUser(email).close(),
                () -> disableKeycloakUser(email).close()
        ));

        rollbackManager.addCommand(new Command(
                () -> createFhirPractitioner(user).close(),
                () -> {}
        ));

        try {
            rollbackManager.executeCommands();
        } catch (Exception e){
            return Response.status(RestResponse.Status.EXPECTATION_FAILED).build();
        }

        user.setEnabled(true);
        return Response.ok(user).build();
    }

    public Response updateUser(User user) {
        RollbackManager rollbackManager = new RollbackManager();

        User foundUser = User.fromUserRepresentation(getUserByEmail_keycloak(user.getEmail()));
        rollbackManager.addCommand(new Command(
                () -> updateKeycloakUser(user).close(),
                () -> updateKeycloakUser(foundUser).close()
        ));

        rollbackManager.addCommand(new Command(
                () -> updateFhirPractitioner(user).close(),
                () -> {}
        ));

        try {
            rollbackManager.executeCommands();
        } catch (Exception e){
            return Response.status(RestResponse.Status.EXPECTATION_FAILED).build();
        }

        return Response.ok(user).build();
    }

    public Response deleteUser(String email) {
        RollbackManager rollbackManager = new RollbackManager();

        User foundUser = User.fromUserRepresentation(getUserByEmail_keycloak(email));

        rollbackManager.addCommand(new Command(
                () -> deleteKeycloakUser(email),
                () -> createKeycloakUser(foundUser).close()
        ));

        rollbackManager.addCommand(new Command(
                () -> {
                 try {
                     deleteFhirPractitioner(email);
                 } catch (IndexOutOfBoundsException e){
                     LOG.info("No such Fhir Practitioner: " + email);
                 }
                },
                () -> {}
        ));

        try {
            rollbackManager.executeCommands();
        } catch (Exception e){
            return Response.status(RestResponse.Status.EXPECTATION_FAILED).build();
        }

        return Response.ok().build();
    }

    public Response createKeycloakUser(User user) {
        try {
            LOG.info("Creating Keycloak User: " + user.getEmail());

            user.setEnabled(false);
            UserRepresentation userRepresentation = User.toUserRepresentation(user);
            UsersResource usersResource = getRealm().users();
            Response response = usersResource.create(userRepresentation);
            user.setId(CreatedResponseUtil.getCreatedId(response));
            Objects.requireNonNull(user.getId(), "User ID cannot be null after creation.");

            LOG.info("Keycloak User created: " + user.getEmail() + ". Setting password...");

            if(null != user.getPassword()){
                // Prepare the credential for the user's password
                CredentialRepresentation credentialPassword = new CredentialRepresentation();
                credentialPassword.setTemporary(false);
                credentialPassword.setType(CredentialRepresentation.PASSWORD);
                credentialPassword.setValue(user.getPassword());
                UserResource userResource = usersResource.get(user.getId());
                Objects.requireNonNull(userResource, "UserResource cannot be null for password reset.");

                // Reset the user's password
                userResource.resetPassword(credentialPassword);

                LOG.info("Password set for Keycloak User: " + user.getEmail());
            }


            return Response.ok(user).build();
        } catch (Exception e) {
            LOG.error("Error creating Keycloak user: " + user.getEmail(), e);
            throw e;
        }
    }

    public Response enableKeycloakUser(String email) {
        LOG.info("Enabling user {}...", email);
        try {
            UserRepresentation userRepresentation = getUserByEmail_keycloak(email);
            Objects.requireNonNull(userRepresentation);
            userRepresentation.setEnabled(true);
            getRealm().users().get(userRepresentation.getId()).update(userRepresentation);
            return Response.ok(getUserByEmail_keycloak(email)).build();
        } catch (Exception e) {
            LOG.error("Error enabling Keycloak user: " + email, e);
            throw e;
        }
    }

    public Response disableKeycloakUser(String email) {
        LOG.info("Disabling user {}...", email);
        try {
            UserRepresentation userRepresentation = getUserByEmail_keycloak(email);
            Objects.requireNonNull(userRepresentation);
            userRepresentation.setEnabled(false);
            getRealm().users().get(userRepresentation.getId()).update(userRepresentation);
            return Response.ok(getUserByEmail_keycloak(email)).build();
        } catch (Exception e) {
            LOG.error("Error enabling Keycloak user: " + email, e);
            throw e;
        }
    }

    public Response createFhirPractitioner(User user) {
        LOG.info("Creating FHIR practitioner {}...", user.getEmail());

        try {
            String practitionerId = practitionerController.create(User.toPractitioner(user).setActive(true)).getIdPart();
            Objects.requireNonNull(practitionerId);
            return Response.ok(practitionerController.encodeResourceToString(practitionerController.read(practitionerId))).build();
        } catch (NullPointerException e) {
            LOG.error("Error creating FHIR practitioner: " + user.getEmail(), e);
            throw e;
        }
    }

    public Response updateKeycloakUser(User user) {
        UserResource userResource = getRealm().users().get(user.getId());

        // Attempt to find the user by email
        try {
            userResource.update(User.toUserRepresentation(user));
            LOG.info("User updated successfully.");
            return Response.ok(user).build();
        } catch (Exception e) {
            LOG.error("Error retrieving KEYCLOAK user: " + user.getEmail(), e);
            throw e;
        }
    }


    public Response updateFhirPractitioner(User user) {
        // Updating Fhir Practitioner Resource
        try {
            String practitioner = getUserByEmail_fhir(user.getEmail()).getIdPart();
            Objects.requireNonNull(practitioner);
            String practitionerUpdated = practitionerController.encodeResourceToString(practitionerController.update(practitioner, User.toPractitioner(user)));
            LOG.info("Practitioner updated: {}", practitionerUpdated);
            return Response.ok(practitionerUpdated).status(Response.Status.ACCEPTED).build();
        } catch (Exception e) {
            LOG.error("Error retrieving FHIR practitioner: " + user.getEmail(), e);
            throw e;
        }
    }

    public void deleteKeycloakUser(String email) {
        try {
            UsersResource usersResource = getRealm().users();
            UserRepresentation userRepresentation = getUserByEmail_keycloak(email);
            Objects.requireNonNull(userRepresentation);
            String userId = userRepresentation.getId();
            UserResource userResource = usersResource.get(userId);
            userResource.remove();
        } catch (Exception e) {
            LOG.error("ERROR: Couldn't remove Keycloak User: {}.", email, e);
            throw e;
        }
    }

    public void deleteFhirPractitioner(String email) {
        try {
            Practitioner practitioner = getUserByEmail_fhir(email);
            Objects.requireNonNull(practitioner);
            practitionerController.delete(practitioner.getIdPart());
        } catch (Exception e) {
            LOG.error("ERROR: Couldn't remove FHIR Practitioner: {}.", email, e);
            throw e;
        }
    }

    public void joinGroup(String email, GroupRepresentation group) {
        getRealm().users().get(getUserByEmail_keycloak(email).getId()).joinGroup(group.getId());
    }

    public void leaveGroup(String email, GroupRepresentation group) {
        System.out.println(group.getName());
        getRealm().users().get(getUserByEmail_keycloak(email).getId()).leaveGroup(group.getId());
    }

    public UserRepresentation getUserByEmail_keycloak(String email) throws OperationException {
        try {
            return getRealm().users().search(email).get(0);
        } catch (Exception e) {
            LOG.error("ERROR: Couldn't find Keycloak user: {}", email);
            e.printStackTrace();
            throw new OperationException("Couldn't find Keycloak user", OperationOutcome.IssueSeverity.ERROR);
        }
    }

    public Practitioner getUserByEmail_fhir(String email) throws OperationException {
        try {
            return (Practitioner) practitionerController.search("email=" + email).getEntry().get(0).getResource();
        } catch (Exception e) {
            LOG.info(practitionerController.encodeResourceToString(practitionerController.search("email=" + email).getEntry().get(0).getResource()));
            LOG.error("ERROR: Couldn't find FHIR practitioner: {}", email);
            e.printStackTrace();
            throw new OperationException("Couldn't find FHIR practitioner", OperationOutcome.IssueSeverity.ERROR);
        }
    }

}

