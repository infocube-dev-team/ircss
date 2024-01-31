package org.quarkus.configuration;

import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;

@ApplicationScoped
public class KeycloakConfig {

    @ConfigProperty(name="quarkus.keycloak.admin-client.server-url")
    String serverUrl;
    @ConfigProperty(name="quarkus.keycloak.admin-client.realm")
    String realm;
    @ConfigProperty(name="quarkus.keycloak.admin-client.client-id")
    String clientId;
    @ConfigProperty(name="quarkus.keycloak.admin-client.client-secret")
    String clientSecret;
    @ConfigProperty(name="quarkus.keycloak.admin-client.grant-type")
    String grantType;
    @ConfigProperty(name="quarkus.keycloak.admin-client.username")
    String username;
    @ConfigProperty(name="quarkus.keycloak.admin-client.password")
    String password;


    public Keycloak getKeycloakClient(String clientUsername, String clientPassword){
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm)
                .clientId(clientId)
                .clientSecret(clientSecret)
                .grantType(grantType)
                .username(clientUsername)
                .password(clientPassword)
                .build();
    }

    public Keycloak getKeycloakAdmin(){
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm)
                .clientId(clientId)
                .clientSecret(clientSecret)
                .grantType(grantType)
                .username(username)
                .password(password)
                .build();
    }





}
