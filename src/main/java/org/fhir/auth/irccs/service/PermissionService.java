package org.fhir.auth.irccs.service;


import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.fhir.auth.irccs.entity.Permission;
import org.fhir.auth.irccs.entity.PermissionWrapper;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.*;
import org.keycloak.admin.client.token.TokenManager;
import org.keycloak.representations.idm.authorization.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

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

    public Response getPermission(String groupId){

        return Response.ok(
                "{\n" +
                        "    \"groupId\": \"df150a40-430c-4afa-98bc-6f970b2bcb95\",\n" +
                        "    \"groupName\": \"admin\",\n" +
                        "    \"permissions\": [\n" +
                        "        {\n" +
                        "            \"resource\": \"Practitioner\",\n" +
                        "            \"read\": true,\n" +
                        "            \"create\": true,\n" +
                        "            \"update\": false,\n" +
                        "            \"history\": false,\n" +
                        "            \"delete\": false,\n" +
                        "            \"search\": false\n" +
                        "        },\n" +
                        "          {\n" +
                        "            \"resource\": \"Observation\",\n" +
                        "            \"read\": false,\n" +
                        "            \"create\": true,\n" +
                        "            \"update\": false,\n" +
                        "            \"history\": true,\n" +
                        "            \"delete\": false,\n" +
                        "            \"search\": false\n" +
                        "        },\n" +
                        "          {\n" +
                        "            \"resource\": \"ResearchStudy\",\n" +
                        "            \"read\": false,\n" +
                        "            \"create\": true,\n" +
                        "            \"update\": false,\n" +
                        "            \"history\": false,\n" +
                        "            \"delete\": true,\n" +
                        "            \"search\": false\n" +
                        "        },\n" +
                        "          {\n" +
                        "            \"resource\": \"PractitionerRole\",\n" +
                        "            \"read\": true,\n" +
                        "            \"create\": true,\n" +
                        "            \"update\": false,\n" +
                        "            \"history\": false,\n" +
                        "            \"delete\": false,\n" +
                        "            \"search\": true\n" +
                        "        },\n" +
                        "          {\n" +
                        "            \"resource\": \"CarePlan\",\n" +
                        "            \"read\": true,\n" +
                        "            \"create\": true,\n" +
                        "            \"update\": false,\n" +
                        "            \"history\": false,\n" +
                        "            \"delete\": false,\n" +
                        "            \"search\": true\n" +
                        "        }\n" +
                        "    ]\n" +
                        "}"
        ).build();

        /*List<PolicyRepresentation> policies = getRealm().clients().get(getRealm().clients().findByClientId(clientId).get(0).getId())
                .authorization().policies().policies().stream()
                .filter(x -> {
                    List<Map<String, String>> groupsList = null;
                    try {
                        groupsList = new ObjectMapper().readValue(x.getConfig().get("groups"), new TypeReference<List<Map<String, String>>>() {
                        });
                    } catch (JsonProcessingException e) {
                        throw new RuntimeException(e);
                    }
                    return groupsList.stream().anyMatch(group -> groupId.equals(group.get("id")));
                }).toList();

        return Response.ok(getRealm().groups().group(groupId).roles()).build();*/
    }

    // Move it to a Fhir centered-class static
    private Response createResource(String groupName, String resourceName, String type, AuthorizationResource authzResource) throws Exception {
        String policyName = String.format("Policy - %s", groupName.toUpperCase());
        String groupId;
        String adminGroupId;

        try {
           groupId = getRealm().groups().groups(groupName,  0,  1, false).get(0).getId();
           adminGroupId = getRealm().groups().groups("admin",  0,  1, false).get(0).getId();
        } catch (Exception e){
            LOG.error("ERROR: Couldn't find group {}", groupName, e);
            throw new Exception("ERROR: Couldn't find group " + groupName);
        }
        ensureGroupPolicyExists(policyName, groupId, adminGroupId, authzResource);
        String calculatedName = String.format("%s Resource", resourceName);
        ensureResourcesExists(calculatedName, authzResource, resourceName);

        return ensurePermissionExists(resourceName, policyName, type, authzResource, groupId);
    }

    public Response createPermission(PermissionWrapper permission) {
        AuthorizationResource authzResource = getRealm().clients().get(getRealm().clients().findByClientId(clientId).get(0).getId()).authorization();

        for (Permission p : permission.getPermissions()) {

            for (String scopeType : p.getDisabled()) {
                try {
                    String groupId = getRealm().groups().groups(permission.getGroupName(),  0,  1, false).get(0).getId();
                    String calculatedName = String.format("%s: %s Permission", scopeType.toUpperCase(), p.getResource());
                    authzResource.permissions().resource();
                    ScopePermissionResource permissionResource = authzResource.permissions().scope().findById(authzResource.permissions().scope().findByName(calculatedName).getId());
                    List<PolicyRepresentation> policies = permissionResource.associatedPolicies();
                    policies.removeIf(x -> x.getDescription().equals(groupId));
                    ScopePermissionRepresentation scopePermissionRepresentation = permissionResource.toRepresentation();
                    scopePermissionRepresentation.setPolicies(policies.stream().map(AbstractPolicyRepresentation::getName).collect(Collectors.toSet()));
                    permissionResource.update(scopePermissionRepresentation);
                } catch (Exception e){LOG.debug("Couldn't find permission policy to delete");}
            }

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

    private Response ensureGroupPolicyExists(String policyName, String groupId, String adminGroupId, AuthorizationResource authzResource) {
        Response policy = null;

        try {
            policy = Response.ok(authzResource.policies().group().findById(authzResource.policies().group().findByName(policyName).getId())).build();
        } catch (Exception e) {
            GroupPolicyRepresentation groupPolicyRepresentation = new GroupPolicyRepresentation();
            groupPolicyRepresentation.setName(policyName);
            groupPolicyRepresentation.addGroup(groupId);
            groupPolicyRepresentation.setDescription(groupId);
            policy = authzResource.policies().group().create(groupPolicyRepresentation);
            policy.close();
        }
        return policy;
    }

    private Response ensureResourcesExists(String resourceName, AuthorizationResource authzResource, String resource) {
        Response res = null;
        try {
            res = Response.ok(authzResource.resources().findByName(resourceName + " BASE").get(0)).build();
        } catch (Exception e) {
            ResourceRepresentation baseResource = new ResourceRepresentation();
            String baseResourceName = resourceName + " BASE";
            baseResource.setName(baseResourceName);
            baseResource.setDisplayName(baseResourceName);
            baseResource.addScope("GET", "PUT", "DELETE");
            baseResource.setUris(new HashSet<>(Collections.singleton("/fhir/" + resource + "/{id}")));

            authzResource.resources().create(baseResource).close();

            ResourceRepresentation historyResource = new ResourceRepresentation();
            String historyResourceName = resourceName + " HISTORY";
            historyResource.setName(historyResourceName);
            historyResource.setDisplayName(historyResourceName);
            historyResource.addScope("GET");
            historyResource.setUris(new HashSet<>(List.of(
                    "/fhir/" + resource + "/_history",
                    "/fhir/" + resource + "/{id}/_history",
                    "/fhir/" + resource + "/{id}/_history/{version_id}"
            )));

            authzResource.resources().create(historyResource).close();

            ResourceRepresentation createResource = new ResourceRepresentation();
            String createResourceName = resourceName + " CREATE";
            createResource.setName(createResourceName);
            createResource.setDisplayName(createResourceName);
            createResource.addScope("POST");
            createResource.setUris(new HashSet<>(Collections.singleton("/fhir/" + resource)));

            authzResource.resources().create(createResource).close();

            ResourceRepresentation searchResource = new ResourceRepresentation();
            String searchResourceName = resourceName + " SEARCH";
            searchResource.setName(searchResourceName);
            searchResource.setDisplayName(searchResourceName);
            searchResource.addScope("GET");
            searchResource.setUris(new HashSet<>(List.of("/fhir/" + resource, "/fhir/" + resource + "/_search")));
            authzResource.resources().create(searchResource).close();
        }
        return res;
    }

    private Response ensurePermissionExists(String resourceName, String policyName, String type, AuthorizationResource authzResource, String groupId) {
        Response resourcePermissionCreation = null;
        List<String> policiesAssociated = new ArrayList<>();
        String calculatedName = String.format("%s: %s Permission", type.toUpperCase(), resourceName);
        try {
            policiesAssociated.addAll(authzResource.permissions().scope().findById(authzResource.permissions().scope().findByName(calculatedName).getId()).associatedPolicies().stream().map(AbstractPolicyRepresentation::getName).toList());
            authzResource.permissions().scope().findById(authzResource.permissions().scope().findByName(calculatedName).getId()).remove();
        }
        catch (Exception e){
            LOG.info("Couldn't locate permission", e);
        } finally {
            ScopePermissionRepresentation resourcePermission = new ScopePermissionRepresentation();
            resourcePermission.setName(String.format("%s: %s Permission", type.toUpperCase(), resourceName));
            policiesAssociated.add(authzResource.policies().group().findByName(policyName).getName());
            policiesAssociated.add("Admin Policy");
            resourcePermission.addPolicy(policiesAssociated.toArray(new String[0]));
            String scope;
            resourcePermission.setDecisionStrategy(DecisionStrategy.AFFIRMATIVE);

            String findResource;

            switch (type.toLowerCase()) {
                case "create":
                    findResource = String.format("%s Resource CREATE", resourceName);
                    scope = "POST";
                    break;
                case "read":
                    findResource = String.format("%s Resource BASE", resourceName);
                    scope = "GET";
                    break;
                case "update":
                    findResource = String.format("%s Resource BASE", resourceName);
                    scope = "PUT";
                    break;
                case "delete":
                    findResource = String.format("%s Resource BASE", resourceName);
                    scope = "DELETE";
                    break;
                case "search":
                    findResource = String.format("%s Resource SEARCH", resourceName);
                    scope = "GET";
                    break;
                case "history":
                    findResource = String.format("%s Resource HISTORY", resourceName);
                    scope = "GET";
                    break;
                default:
                    throw new IllegalArgumentException("Invalid resource type: " + type);
            }

            resourcePermission.addScope(scope);
            resourcePermission.addResource(authzResource.resources().findByName(findResource).get(0).getId());
            resourcePermissionCreation = authzResource.permissions().scope().create(resourcePermission);
            resourcePermissionCreation.close();
        }
        return resourcePermissionCreation;
    }



}

