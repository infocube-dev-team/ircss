package org.quarkus.controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.hl7.fhir.r5.model.Practitioner;
import org.quarkus.entity.User;
import org.quarkus.irccs.client.restclient.FhirClient;
import org.quarkus.service.UserService;

public class UserControllerImpl implements UserController{

    @Inject
    UserService userService;

    public Response getAllUsers(String email) {
        return userService.getAllUsers(email);
    }

    public Response createUser(User user) {
        return userService.createUser(user);
    }

    public Response updateUser(User user) {
        return userService.updateUser(user);
    }

    public Response deleteUser(String email) {
        return userService.deleteUser(email);
    }

}
