package org.quarkus.service;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
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

public class UserService implements UserController{
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

    public Response createUser(User user) {
        // Define user
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setEnabled(true);
        userRepresentation.setUsername(user.getName() + " " + user.getSurname());
        userRepresentation.setFirstName(user.getName());
        userRepresentation.setLastName(user.getSurname());
        userRepresentation.setEmail(user.getEmail());
        userRepresentation.setEmailVerified(true);

        UsersResource usersResource = getRealm()
                .users();
        Response response = usersResource
                .create(userRepresentation);
        String userId = CreatedResponseUtil.getCreatedId(response);
        CredentialRepresentation passwordCred = new CredentialRepresentation();
        passwordCred.setTemporary(false);
        passwordCred.setType(CredentialRepresentation.PASSWORD);
        passwordCred.setValue(user.getPassword());

        UserResource userResource = usersResource.get(userId);
        userResource.resetPassword(passwordCred);

        System.out.println(userResource);

        return Response.ok(userResource.toRepresentation()).build();

    }

    public Response getUserById(String id) {
        return Response.ok(getRealm().users().get(id)).build();
    }

    public void updateUser(Long id, User user) {

    }

    public void deleteUser(Long id) {

    }

/*
    public User getUserById(Long id) {
        return users.stream().filter(user -> user.getId().equals(id)).findFirst().orElseThrow();
    }

    public void updateUser(Long id, User userToUpdate) {
        User findUser = getUserById(id);
        int index = users.indexOf(findUser);
        users.set(index, new User(findUser.getId(), userToUpdate.getName(), userToUpdate.getSurname()));
    }

    public void deleteUser(Long id) {
        users.removeIf(user -> user.getId().equals(id));
    }
*/

}
