package org.fhir.auth.service;


import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.MultivaluedHashMap;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;

import org.fhir.auth.entity.User;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.hl7.fhir.r5.model.*;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

@ApplicationScoped
public class UserService {
    private final static Logger LOG = LoggerFactory.getLogger(UserService.class);
    @Inject
    Keycloak keycloak;
    @Inject
    PractitionerController practitionerController;
    @ConfigProperty(name = "quarkus.keycloak.admin-client.realm")
    String realm;

    private RealmResource getRealm(){return keycloak.realm(realm);}

    public Response getAllUsers(String email) {
        if(email.isEmpty()) return Response.ok(getRealm().users().list()).build();
        return Response.ok(getUserByEmail_keycloak(email)).build();
    }

    public Response createUser(User user) {
        // Creating Keycloak User Representation

        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setUsername(user.getEmail());
        userRepresentation.setEmail(user.getEmail());
        userRepresentation.setEmailVerified(true);
        userRepresentation.setEnabled(true);
        userRepresentation.setFirstName(user.getName());
        userRepresentation.setLastName(user.getSurname());
        userRepresentation.setAttributes(new HashMap<>(){{
            put("organizationRequest", user.getOrganizationRequest());
            put("phoneNumber", List.of(user.getPhoneNumber()));
        }});

        UsersResource usersResource = getRealm()
                .users();
        Response response = usersResource
                .create(userRepresentation);
        String userId = CreatedResponseUtil.getCreatedId(response);

        CredentialRepresentation credentialPassword = new CredentialRepresentation();
        credentialPassword.setTemporary(false);
        credentialPassword.setType(CredentialRepresentation.PASSWORD);
        credentialPassword.setValue(user.getPassword());

        UserResource userResource = usersResource.get(userId);
        userResource.resetPassword(credentialPassword);

        // Creating Fhir Practitioner Resource
        Practitioner practitioner = new Practitioner();
        practitioner.setName(List.of(new HumanName().setText(user.getName()).setFamily(user.getSurname()).setUse(HumanName.NameUse.OFFICIAL).setGiven(List.of(new StringType(user.getName() + " " + user.getSurname())))));
        practitioner.setTelecom(List.of(new ContactPoint().setSystem(ContactPoint.ContactPointSystem.EMAIL).setUse(ContactPoint.ContactPointUse.WORK).setValue(user.getEmail()), new ContactPoint().setSystem(ContactPoint.ContactPointSystem.PHONE).setUse(ContactPoint.ContactPointUse.WORK).setValue(user.getPhoneNumber())));

        String practitionerCreated = practitionerController.create(practitionerController.encodeResourceToString(practitioner));
        LOG.info("Practitioner created: {}", practitionerCreated);

        return Response.ok().status(Response.Status.CREATED).build();

    }

     public UserRepresentation getUserByEmail_keycloak(String email) {
        return getRealm().users().search(email).get(0);
    }

    public Practitioner getUserByEmail_fhir(String email) {
        MultivaluedMap<String, String> params = new MultivaluedHashMap<>();
        params.put("email", Collections.singletonList(email));
        return (Practitioner) practitionerController.parseResource(practitionerController.search(params), Bundle.class).getEntry().get(0).getResource();
    }

    public Response updateUser(User user) {

        // TODO: Enforce same email policy

        UsersResource usersResource = getRealm().users();

        UserRepresentation userRepresentation = usersResource.search(user.getEmail()).get(0);
        Objects.requireNonNull(userRepresentation);
        String userId = userRepresentation.getId();

        userRepresentation.setEmailVerified(true);
        userRepresentation.setEnabled(true);
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

        UserResource userResource = usersResource.get(userId);
        userResource.resetPassword(credentialPassword);
        userResource.update(userRepresentation);

        // Updating Fhir Practitioner Resource
        MultivaluedMap<String, String> params = new MultivaluedHashMap<>();
        params.put("email", Collections.singletonList(user.getEmail()));

        Practitioner practitioner = (Practitioner) practitionerController.parseResource(practitionerController.search(params), Bundle.class).getEntry().get(0).getResource();
        Objects.requireNonNull(practitioner);
        practitioner.setName(List.of(new HumanName().setText(user.getName()).setFamily(user.getSurname()).setUse(HumanName.NameUse.OFFICIAL).setGiven(List.of(new StringType(user.getName() + " " + user.getSurname())))));
        practitioner.setTelecom(List.of(new ContactPoint().setSystem(ContactPoint.ContactPointSystem.EMAIL).setUse(ContactPoint.ContactPointUse.WORK).setValue(user.getEmail()), new ContactPoint().setSystem(ContactPoint.ContactPointSystem.PHONE).setUse(ContactPoint.ContactPointUse.WORK).setValue(user.getPhoneNumber())));

        String practitionerUpdated = practitionerController.update(practitioner.getIdPart(), practitionerController.encodeResourceToString(practitioner));
        LOG.info("Practitioner updated: {}", practitionerUpdated);

        return Response.ok().status(Response.Status.ACCEPTED).build();

    }

    public Response deleteUser(String email) {

        // TODO: Unassign user from Groups

        UsersResource usersResource = getRealm().users();

        UserRepresentation userRepresentation = usersResource.search(email).get(0);
        Objects.requireNonNull(userRepresentation);
        String userId = userRepresentation.getId();
        UserResource userResource = usersResource.get(userId);
        userResource.remove();


        MultivaluedMap<String, String> params = new MultivaluedHashMap<>();
        params.put("email", Collections.singletonList(email));

        Practitioner practitioner = (Practitioner) practitionerController.parseResource(practitionerController.search(params), Bundle.class).getEntry().get(0).getResource();
        Objects.requireNonNull(practitioner);

        practitionerController.delete(practitioner.getIdPart());

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

