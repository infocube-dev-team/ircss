package org.fhir.auth.irccs.controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.fhir.auth.irccs.entity.Group;
import org.fhir.auth.irccs.service.GroupService;

public class GroupControllerImpl implements GroupController {

    @Inject
    GroupService groupService;

    public Response getAllGroups(String name) {
        return groupService.getAllGroups(name);
    }

    public Response createGroup(Group group) {
        return groupService.createKeycloakGroup(group, group.getParentGroupId());
    }

    public Response updateGroup(Group group) {
        return groupService.updateKeycloakGroup(group);
    }

    public Response deleteGroup(String id) {
        return groupService.deleteKeycloakGroup(id);
    }

}
