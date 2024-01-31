package org.quarkus.controller;

import org.quarkus.entity.User;
import org.quarkus.service.UserService;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

public class UserControllerImpl implements UserController{

    @Inject
    UserService userService;


    public Response getAllUsers() {
        return userService.getAllUsers();
    }

    public Response createGroup(String x){
        return userService.createGroup(x);
    }

    public Response createUser(User user) {
        return userService.createUser(user.getPractioner(),user.getPassword());
    }

    public Response getUserById(String id) {
        return userService.getUserById(id);
    }

    public void updateUser(Long id, User user) {

    }

    public void deleteUser(Long id) {

    }

}
