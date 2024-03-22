package org.fhir.auth.irccs.controller;

import io.quarkus.oidc.common.runtime.OidcCommonConfig;
import io.quarkus.security.identity.SecurityIdentity;
import io.smallrye.jwt.build.Jwt;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.fhir.auth.irccs.entity.User;
import org.fhir.auth.irccs.service.KeycloakService;
import org.fhir.auth.irccs.service.PractitionerClient;
import org.fhir.auth.irccs.service.UserService;
import org.keycloak.representations.AccessTokenResponse;
import org.keycloak.representations.JsonWebToken;

import java.security.Principal;
import java.util.HashMap;

public class UserControllerImpl implements UserController{

    @Inject
    UserService userService;


    @RestClient
    PractitionerClient practitionerClient;

    @Inject
    KeycloakService keycloakService;

    public Response getAllUsers(String email) {
        return userService.getAllUsers(email);
    }

    public Response createUser(User user) {
        return userService.createKeycloakUser(user);
    }

    public String signUp(String user){
        Response token = keycloakService.getAdminToken();
        if(token.hasEntity()){
            String jwtToken = "Bearer " + token.readEntity(AccessTokenResponse.class).getToken();
            return practitionerClient.createUser(jwtToken, user);
        }
        return null;
    }

    public String me(@Context SecurityContext ctx){
        String email = ctx.getUserPrincipal().getName();
        if(null != email){
            Response token = keycloakService.getAdminToken();
            if(token.hasEntity()) {
                String jwtToken = "Bearer " + token.readEntity(AccessTokenResponse.class).getToken();
                return practitionerClient.getCurrentPractitioner(jwtToken, email);
            }
        }
        return null;
    }

    public Response tokenExchange(String payload) {
        return keycloakService.exchangeToken(payload);
    }

    public Response logout(String payload){
        return keycloakService.logout(payload);
    }

    public Response enableUser(String email) {
        return userService.enableKeycloakUser(email);
    }

    public Response updateUser(User user) {
        return userService.updateKeycloakUser(user);
    }

    public Response deleteUser(String email) {
        return userService.deleteKeycloakUser(email);
    }

    public Response forgotPassword(HashMap<String,String> payload) {
        return userService.forgotPassword(payload);    }

    public Response updatePassword(HashMap<String,String> payload) {
        return userService.updatePassword(payload);    }

}
