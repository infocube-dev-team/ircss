package org.quarkus.controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.hl7.fhir.r5.model.Practitioner;
import org.quarkus.entity.Group;
import org.quarkus.entity.User;
import org.quarkus.irccs.client.restclient.FhirClient;
import org.quarkus.service.GroupService;
import org.quarkus.service.UserService;

public class GroupControllerImpl implements GroupController {

    @Inject
    GroupService groupService;

    public Response getAllGroups(String name) {
        return groupService.getAllGroups(name);
    }

    public Response createGroup(Group group) {
        return groupService.createGroup(group);
    }

    public Response updateGroup(Group group) {
        return groupService.updateGroup(group);
    }

    public Response deleteGroup(String name) {
        return groupService.deleteGroup(name);
    }

}
