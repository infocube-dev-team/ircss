package org.quarkus.service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.hl7.fhir.r5.model.ContactPoint;
import org.hl7.fhir.r5.model.Practitioner;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.resource.GroupsResource;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.quarkus.configuration.KeycloakConfig;
import org.quarkus.controller.UserController;
import org.quarkus.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class UserService {
    private final static Logger LOG = LoggerFactory.getLogger(UserService.class);
    @Inject
    KeycloakConfig keycloak;

    @Inject
    SecurityIdentity keycloakSecurityContext;

    @ConfigProperty(name = "quarkus.keycloak.admin-client.realm")
    String realm;

    private RealmResource getRealm(){
        return keycloak.getKeycloakAdmin().realm(realm);
    }

    public Response getAllUsers() {
        return Response.ok(getRealm().users().list()).build();
    }

    public Response createGroup(String x){
        GroupRepresentation g = new GroupRepresentation();
        g.setName(x);
        GroupsResource o = getRealm().groups();

        return Response.ok(o.add(g)).build();
    }

    public Response createUser(Practitioner practitioner, String password) {
        // Define user
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setEnabled(true);
        // practitioner.getTelecom().get(0).getValue() è l'indirizzo di posta elettronica
        List<ContactPoint> list = practitioner
                .getTelecom()
                .stream()
                .filter( c -> c.getSystem().equals(ContactPoint.ContactPointSystem.EMAIL))
                .toList();
        String email = list.get(0).getValue();
        Objects.requireNonNull(email);
        userRepresentation.setUsername(email);
        userRepresentation.setEmail(email);

        LOG.info("user id: {}", practitioner.getId());

        UsersResource usersResource = getRealm()
                .users();
        Response response = usersResource
                .create(userRepresentation);
        String userId = CreatedResponseUtil.getCreatedId(response);

        LOG.info("userId: {}", userId);

        CredentialRepresentation credentialPassword = new CredentialRepresentation();
        credentialPassword.setTemporary(false);
        credentialPassword.setType(CredentialRepresentation.PASSWORD);
        credentialPassword.setValue(password);

        UserResource userResource = usersResource.get(userId);
        userResource.resetPassword(credentialPassword);


        return Response.ok(userResource.toRepresentation()).build();

    }

    public Response getUserById(String id) {
        return Response.ok(getRealm().users().get(id)).build();
    }

    public void updateUser(Long id, User user) {

    }

    public void deleteUser(Long id) {

    }

}
