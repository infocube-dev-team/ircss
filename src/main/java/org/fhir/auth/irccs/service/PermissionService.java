package org.fhir.auth.irccs.service;


import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.fhir.auth.irccs.entity.PermissionWrapper;
import org.jboss.resteasy.reactive.ClientWebApplicationException;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.*;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.IntStream;

@ApplicationScoped
public class PermissionService {
    private final static Logger LOG = LoggerFactory.getLogger(PermissionService.class);
    @Inject
    Keycloak keycloak;

    @ConfigProperty(name = "quarkus.keycloak.admin-client.realm")
    String realmName;

    private RealmResource getRealm() {
        return keycloak.realm(realmName);
    }

    public Response getPermission(String groupName){
        GroupRepresentation group = new GroupRepresentation();
        String groupId = getRealm().groups().groups(groupName,  0,  1, false).get(0).getId();
        group = getRealm().groups().group(groupId).toRepresentation();
        return Response.ok(PermissionWrapper.toPermissionWrapper(groupId, groupName, group.getRealmRoles())).build();
    }
    public Response addRoles(PermissionWrapper permission) {
        GroupResource group = null;
        List<String> roles = permission.getPermissions().stream().flatMap(role -> IntStream.range(0, role.calcTruePermissions().size()).mapToObj(i -> role.getResource().toLowerCase() + ":" + role.calcTruePermissions().get(i))).toList();
        if(null != permission.getGroupId()){
            group = getRealm().groups().group(permission.getGroupId());
        } else if(null != permission.getGroupName()){
            String groupId = getRealm().groups().groups(permission.getGroupName(),  0,  1, false).get(0).getId();
            group = getRealm().groups().group(groupId);
        }

        List<RoleRepresentation> mappedRoles = roles.stream().map(role -> getRealm().roles().get(role).toRepresentation()).toList();
       try {
            List<RoleRepresentation> toDelete = group.roles().realmLevel().listEffective().stream().filter(role -> !mappedRoles.contains(role) && role.getName().matches("\\w+:\\w+")).toList();
           group.roles().realmLevel().remove(toDelete);
       } catch (ClientWebApplicationException e){
           LOG.info("No roles to delete.");
       }

        group.roles().realmLevel().add(mappedRoles);
        GroupRepresentation groupRepresentation = group.toRepresentation();
        groupRepresentation.setRealmRoles(roles);
        group.update(groupRepresentation);
        return Response.ok().build();
    }



}

