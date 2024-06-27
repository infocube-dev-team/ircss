package org.fhir.auth.irccs.service;


import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.fhir.auth.irccs.entity.OfficeType;
import org.fhir.auth.irccs.entity.PermissionWrapper;
import org.jboss.resteasy.reactive.ClientWebApplicationException;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.*;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
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

    public Response setOfficeType(OfficeType officeType){
        GroupResource group = getRealm().groups().group(officeType.getGroupId());
        try {
            GroupRepresentation groupRepresentation = group.toRepresentation();
            List<RoleRepresentation> roleNames = new ArrayList<>();

            RoleResource backOfficeRole = getRealm().roles().get("backOffice");
            RoleResource frontOfficeRole = getRealm().roles().get("frontOffice");

            if(officeType.isBackOffice()){
                roleNames.add(backOfficeRole.toRepresentation());
            }
            if(officeType.isFrontOffice()){
                roleNames.add(frontOfficeRole.toRepresentation());
            }

            group.roles().realmLevel().remove(List.of(backOfficeRole.toRepresentation(), frontOfficeRole.toRepresentation()));
            group.roles().realmLevel().add(roleNames);
            group.update(groupRepresentation);
            return Response.ok(group).build();
        } catch (ClientWebApplicationException e){
            if(e.getResponse().getStatus() == 404){
                LOG.info("Couldn\'t find Group by ID.");
                return Response.status(404).build();
            }
            return Response.status(e.getResponse().getStatus()).build();
        }
    }

    public Response getOfficeType(String groupId){
        GroupResource group = getRealm().groups().group(groupId);
        try {
            List<String> groupRoles = group.roles().realmLevel().listAll().stream().map(RoleRepresentation::getName).toList();
            OfficeType officeType = new OfficeType();
            officeType.setGroupId(groupId);
            officeType.setFrontOffice(groupRoles.contains("frontOffice"));
            officeType.setBackOffice(groupRoles.contains("backOffice"));
            return Response.ok(officeType).build();
        } catch (ClientWebApplicationException e){
            if(e.getResponse().getStatus() == 404){
                LOG.info("Couldn\'t find Group by ID.");
                return Response.status(404).build();
            }
            return Response.status(e.getResponse().getStatus()).build();
        }
    }

    public Response getPermission(String groupId){
        GroupRepresentation group = new GroupRepresentation();
        try {
            group = getRealm().groups().group(groupId).toRepresentation();
        } catch (ClientWebApplicationException e){
            if(e.getResponse().getStatus() == 404){
                LOG.info("Couldn\'t find Group by ID.");
                return Response.status(404).build();
            }
        }

        return Response.ok(PermissionWrapper.toPermissionWrapper(groupId, getRealm().groups().group(groupId).toRepresentation().getName(), group.getRealmRoles())).build();
    }
    public Response addRoles(PermissionWrapper permission) {
        GroupResource group = null;
        List<String> roles = permission.getPermissions().stream().flatMap(role -> IntStream.range(0, role.calcTruePermissions().size()).mapToObj(i -> role.getResource().toLowerCase() + ":" + role.calcTruePermissions().get(i))).toList();
        group = getRealm().groups().group(permission.getGroupId());
        try {
            GroupRepresentation groupRepresentation = group.toRepresentation();
        } catch (ClientWebApplicationException e){
            if(e.getResponse().getStatus() == 404){
                LOG.info("Couldn\'t find Group by ID.");
                return Response.status(404).build();
            }
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

