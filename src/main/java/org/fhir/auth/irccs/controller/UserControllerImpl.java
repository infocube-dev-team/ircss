package org.fhir.auth.irccs.controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.fhir.auth.irccs.entity.User;
import org.fhir.auth.irccs.service.KeycloakService;
import org.fhir.auth.irccs.service.UserService;

import java.util.HashMap;

public class UserControllerImpl implements UserController{

    @Inject
    UserService userService;

    @Inject
    KeycloakService keycloakService;

    public Response getAllUsers(String email) {
        return userService.getAllUsers(email);
    }

    public Response createUser(User user) {
        return userService.createKeycloakUser(user);
    }
    public Response signUp(User user) {
        return userService.createKeycloakUser(user);
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
