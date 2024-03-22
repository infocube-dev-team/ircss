package org.fhir.auth.irccs.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import io.vertx.core.json.JsonObject;
import io.vertx.core.net.impl.URIDecoder;
import io.vertx.core.parsetools.JsonParser;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Response;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.keycloak.representations.AccessToken;
import org.keycloak.representations.AccessTokenResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@ApplicationScoped
public class KeycloakService {
    private final static Logger LOG = LoggerFactory.getLogger(KeycloakService.class);

    @ConfigProperty(name = "keycloak-realm")
    String realm;

    @ConfigProperty(name = "keycloak-client_secret")
    String clientSecret;

    @ConfigProperty(name = "keycloak-client_id")
    String clientId;

    @ConfigProperty(name = "keycloak-admin-username")
    String adminUsername;

    @ConfigProperty(name = "keycloak-admin-password")
    String adminPassword;

    @ConfigProperty(name = "quarkus.oidc.auth-server-url")
    String authServer;


    public Response exchangeToken(String payload) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            LOG.info("Asking for access token to: " + authServer + "/protocol/openid-connect/token");
            HttpPost request = new HttpPost(authServer + "/protocol/openid-connect/token");
            payload = String.format(URIDecoder.decodeURIComponent(payload) + "&client_id=%s&client_secret=%s", clientId, clientSecret);
            StringEntity entity = new StringEntity(payload, ContentType.APPLICATION_FORM_URLENCODED);
            request.setEntity(entity);
            HttpResponse response = httpClient.execute(request);
            AccessTokenResponse responseEntity = new ObjectMapper().readValue(EntityUtils.toString(response.getEntity()), AccessTokenResponse.class);
            LOG.info("Response is: " + responseEntity);
            return Response.status(response.getStatusLine().getStatusCode()).entity(responseEntity).build();
        } catch (IOException e) {
            e.printStackTrace();
            return Response.status(403).build();
        }
    }

    public Response logout(String payload) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost request = new HttpPost(authServer + "/protocol/openid-connect/logout");
            payload = String.format(URIDecoder.decodeURIComponent(payload) + "&client_id=%s&client_secret=%s", clientId, clientSecret);
            StringEntity entity = new StringEntity(payload, ContentType.APPLICATION_FORM_URLENCODED);
            request.setEntity(entity);
            HttpResponse response = httpClient.execute(request);
            HttpEntity responseEntity = response.getEntity();
            return Response.status(response.getStatusLine().getStatusCode()).entity(null != responseEntity ? EntityUtils.toString(responseEntity) : null).build();
        } catch (IOException e) {
            e.printStackTrace();
            return Response.serverError().entity(e.getMessage()).build();
        }
    }


    public Response getAdminToken() {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            LOG.info("Asking for access token to: " + authServer + "/protocol/openid-connect/token");
            HttpPost request = new HttpPost(authServer + "/protocol/openid-connect/token");
            String payload = String.format("client_id=%s&client_secret=%s&grant_type=client_credentials", clientId, clientSecret, adminUsername, adminPassword);
            StringEntity entity = new StringEntity(payload, ContentType.APPLICATION_FORM_URLENCODED);
            request.setEntity(entity);
            HttpResponse response = httpClient.execute(request);
            AccessTokenResponse responseEntity = new ObjectMapper().readValue(EntityUtils.toString(response.getEntity()), AccessTokenResponse.class);
            LOG.info("Response is: " + responseEntity);
            return Response.status(response.getStatusLine().getStatusCode()).entity(responseEntity).build();
        } catch (IOException e) {
            e.printStackTrace();
            return Response.status(403).build();
        }
    }


}

