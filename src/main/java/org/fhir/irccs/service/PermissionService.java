package org.fhir.irccs.service;


import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.*;
import org.keycloak.representations.idm.authorization.ResourceRepresentation;
import org.fhir.irccs.entity.Permission;
import org.fhir.irccs.entity.PermissionWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

@ApplicationScoped
public class PermissionService {
    private final static Logger LOG = LoggerFactory.getLogger(PermissionService.class);
    @Inject
    Keycloak keycloak;

    @Inject
    GroupService groupService;

    @ConfigProperty(name = "quarkus.keycloak.admin-client.realm")
    String realmName;

    @ConfigProperty(name = "quarkus.keycloak.admin-client.client-id")
    String clientId;

    private RealmResource getRealm(){
        return keycloak.realm(realmName);
    }

    private Response createResource(String groupName, String resourceName, String type, AuthorizationResource authzResource){
        ResourceRepresentation resource = new ResourceRepresentation();
        String calculatedName = type.toUpperCase() + " - " + groupName.toUpperCase() + ": " + resourceName + " Resource";
        resource.setName(calculatedName);
        resource.setDisplayName(calculatedName);

        switch (type) {
            case "create" -> {
                resource.addScope("POST");
                resource.setUris(new HashSet<>(Collections.singleton("/" + resourceName + "/*")));
            }
            case "read" -> {
                resource.addScope("GET");
                resource.setUris(new HashSet<>(Collections.singleton("/" + resourceName + "/*")));
            }
            case "update" -> {
                resource.addScope("PUT");
                resource.setUris(new HashSet<>(Collections.singleton("/" + resourceName + "/*")));
            }
            case "delete" -> {
                resource.addScope("DELETE");
                resource.setUris(new HashSet<>(Collections.singleton("/" + resourceName + "/*")));
            }
            case "search" -> {
                resource.addScope("GET");
                resource.setUris(new HashSet<>(Collections.singleton("/" + resourceName + "/_search")));
            }
            case "history" -> {
                resource.addScope("GET");
                resource.setUris(new HashSet<>(List.of("/" + resourceName + "/_history", "/" + resourceName + "/{id}/_history", "/" + resourceName + "/{id}/_history/{version_id}")));
            }
        }

        try (Response resourceCreation = authzResource.resources().create(resource)) { return resourceCreation; }


    }

    public Response createPermission(PermissionWrapper permission) {

        AuthorizationResource authzResource = getRealm().clients().get(getRealm().clients().findByClientId(clientId).get(0).getId()).authorization();

        for (Permission p : permission.getPermissions()) {

            for(String scopeType : p.getPermissions()){
              createResource(permission.getGroupName(), p.getResource(), scopeType, authzResource).close();
            }

            // Create a new policy representation for the group
            /*GroupPolicyRepresentation groupPolicy = new GroupPolicyRepresentation();
            groupPolicy.setName("Group Policy - " + permission.getGroupName());
            groupPolicy.setType("group");
            Set<GroupPolicyRepresentation.GroupDefinition> includedGroups = new HashSet<>();
            includedGroups.add(new GroupPolicyRepresentation.GroupDefinition(groupService.getGroupByName_representation(permission.getGroupName()).getId()));
            groupPolicy.setGroups(includedGroups);
            authzResource.policies().group().create(groupPolicy);*/

            // Create a new resource policy representation for the CRUD operations
            /*ResourcePolicyRepresentation crudPolicy = new ResourcePolicyRepresentation();
            crudPolicy.setName("CRUD Policy - " + p.getResource());
            crudPolicy.setType("resource");
            crudPolicy.setResources(Collections.singletonList(resource.getId()));
            crudPolicy.addResourceType(p.getResource());
            Map<String, Boolean> scopes = new HashMap<>();
            scopes.put("create", p.getCreate());
            scopes.put("read", p.getRead());
            scopes.put("update", p.getUpdate());
            scopes.put("delete", p.getDelete());
            crudPolicy.setScopes(scopes);
            authzResource.policies().resource().create(crudPolicy);*/
        }

        // Return a successful response
        return Response.ok().build();
    }


}

