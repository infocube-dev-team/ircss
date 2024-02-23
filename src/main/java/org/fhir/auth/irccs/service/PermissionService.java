package org.fhir.auth.irccs.service;


import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.fhir.auth.irccs.entity.Permission;
import org.fhir.auth.irccs.entity.PermissionWrapper;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.AuthorizationResource;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.RolesResource;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.authorization.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@ApplicationScoped
public class PermissionService {
    private final static Logger LOG = LoggerFactory.getLogger(PermissionService.class);
    @Inject
    Keycloak keycloak;

    @ConfigProperty(name = "quarkus.keycloak.admin-client.realm")
    String realmName;

    @ConfigProperty(name = "quarkus.keycloak.admin-client.client-id")
    String clientId;

    private RealmResource getRealm() {
        return keycloak.realm(realmName);
    }

    // Move it to a Fhir centered-class static
    private Response createResource(String groupName, String resourceName, String type, AuthorizationResource authzResource) throws Exception {
        ResourceRepresentation resource = new ResourceRepresentation();
        String calculatedName = String.format("%s - %s: %s Resource", type.toUpperCase(), groupName.toUpperCase(), resourceName);
        resource.setName(calculatedName);
        resource.setDisplayName(calculatedName);

        ResourcePermissionRepresentation resourcePermission = new ResourcePermissionRepresentation();
        String policyName = String.format("%s Policy - %s", type.toUpperCase(), groupName.toUpperCase());
        String groupId;

        try {
           groupId = getRealm().groups().groups(groupName,  0,  1, false).get(0).getId();
        } catch (Exception e){
            LOG.error("ERROR: Couldn't find group {}", groupName, e);
            throw new Exception("ERROR: Couldn't find group " + groupName);
        }

        switch (type.toLowerCase()) {
            case "create":
                resource.addScope("POST");
                resource.setUris(new HashSet<>(Collections.singleton("/" + resourceName + "/*")));
                break;
            case "read":
                resource.addScope("GET");
                resource.setUris(new HashSet<>(Collections.singleton("/" + resourceName + "/*")));
                break;
            case "update":
                resource.addScope("PUT");
                resource.setUris(new HashSet<>(Collections.singleton("/" + resourceName + "/*")));
                break;
            case "delete":
                resource.addScope("DELETE");
                resource.setUris(new HashSet<>(Collections.singleton("/" + resourceName + "/*")));
                break;
            case "search":
                resource.addScope("GET");
                resource.setUris(new HashSet<>(Collections.singleton("/" + resourceName + "/_search")));
                break;
            case "history":
                resource.addScope("GET");
                resource.setUris(new HashSet<>(List.of(
                        "/" + resourceName + "/_history",
                        "/" + resourceName + "/{id}/_history",
                        "/" + resourceName + "/{id}/_history/{version_id}"
                )));
                break;
            default:
                throw new IllegalArgumentException("Invalid resource type: " + type);
        }

        ensureGroupPolicyExists(policyName, groupId, authzResource);

        resourcePermission.setName(calculatedName + " Permission");
        resourcePermission.addPolicy(policyName);

        Response resourceCreation = authzResource.resources().create(resource);
        resourcePermission.addResource(authzResource.resources().findByName(calculatedName).get(0).getId());
        Response resourcePermissionCreation = authzResource.permissions().resource().create(resourcePermission);

        resourceCreation.close();
        resourcePermissionCreation.close();

        ResourcePermissionRepresentation adminResourcePermission = new ResourcePermissionRepresentation();
        adminResourcePermission.setResourceType(resourceName);
        adminResourcePermission.addPolicy("Admin Policy");
        adminResourcePermission.setName("Admin " + resourceName.toUpperCase() + " Permission");
        Response adminResourcePermissionCreation = authzResource.permissions().resource().create(adminResourcePermission);
        adminResourcePermissionCreation.close();


        return resourcePermissionCreation;
    }

    public Response createPermission(PermissionWrapper permission) {
        AuthorizationResource authzResource = getRealm().clients().get(getRealm().clients().findByClientId(clientId).get(0).getId()).authorization();

        for (Permission p : permission.getPermissions()) {
            for (String scopeType : p.getPermissions()) {
                try {
                    createResource(permission.getGroupName(), p.getResource(), scopeType, authzResource).close();
                } catch (Exception e){
                    return Response.status(Response.Status.EXPECTATION_FAILED).build();
                }
            }
        }

        return Response.ok().build();
    }

    private void ensureGroupPolicyExists(String policyName, String groupId, AuthorizationResource authzResource) {
        try {
            authzResource.policies().group().findByName(policyName).getId();
        } catch (Exception e) {
            GroupPolicyRepresentation groupPolicyRepresentation = new GroupPolicyRepresentation();
            groupPolicyRepresentation.setName(policyName);
            groupPolicyRepresentation.addGroup(groupId);
            authzResource.policies().group().create(groupPolicyRepresentation).close();
        }
    }

}

