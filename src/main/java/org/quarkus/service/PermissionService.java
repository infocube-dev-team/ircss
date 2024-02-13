package org.quarkus.service;


import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MultivaluedHashMap;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.hl7.fhir.r5.model.*;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.*;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.keycloak.representations.idm.authorization.GroupPolicyRepresentation;
import org.keycloak.representations.idm.authorization.PolicyRepresentation;
import org.keycloak.representations.idm.authorization.ResourceRepresentation;
import org.quarkus.entity.Permission;
import org.quarkus.entity.PermissionWrapper;
import org.quarkus.entity.User;
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

    private RealmResource getRealm(){
        return keycloak.realm(realmName);
    }

    public Response createPermission(PermissionWrapper permission) {


        AuthorizationResource authzResource = getRealm().clients().get("irccs").authorization();

        for (Permission p : permission.getPermissions()) {
            ResourceRepresentation resource = new ResourceRepresentation();
            resource.setName(p.getResource());
            resource.setUris( new HashSet<>(List.of("/" + p.getResource() + "/*"))); // Assuming you want to apply the policy to all paths under the resource
            authzResource.resources().create(resource);

            // Create a new policy representation for the group
            GroupPolicyRepresentation groupPolicy = new GroupPolicyRepresentation();
            groupPolicy.setName("Group Policy - " + permission.getGroupName());
            groupPolicy.setType("group");
            Set<GroupPolicyRepresentation.GroupDefinition> includedGroups = new HashSet<>();
            includedGroups.add(new GroupPolicyRepresentation.GroupDefinition(groupService.getGroupByName_representation(permission.getGroupName()).getId()));
            groupPolicy.setGroups(includedGroups);
            authzResource.policies().group().create(groupPolicy);

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

