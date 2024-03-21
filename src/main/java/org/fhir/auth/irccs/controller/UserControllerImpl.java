package org.fhir.auth.irccs.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.fhir.auth.irccs.entity.User;
import org.fhir.auth.irccs.service.KeycloakService;
import org.fhir.auth.irccs.service.PractitionerClient;
import org.fhir.auth.irccs.service.UserService;
import org.hl7.fhir.r5.model.Practitioner;
import org.keycloak.representations.AccessToken;
import org.keycloak.representations.AccessTokenResponse;
import org.quarkus.irccs.annotations.aspect.AuthFlowInterceptor;
import org.quarkus.irccs.annotations.aspect.LookupTable;
import org.quarkus.irccs.annotations.interfaces.SyncAuthFlow;
import org.quarkus.irccs.annotations.models.AuthMicroserviceClient;
import org.quarkus.irccs.client.controllers.GenericController;
import org.quarkus.irccs.common.constants.FhirConst;

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
        return practitionerClient.createUser("Bearer " + keycloakService.getAdminToken().getToken(), user);
    }

    public AccessTokenResponse tokenExchange(String payload) {
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
