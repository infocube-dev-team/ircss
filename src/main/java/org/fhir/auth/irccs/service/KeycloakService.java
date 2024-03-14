package org.fhir.auth.irccs.service;


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

import java.io.IOException;

@ApplicationScoped
public class KeycloakService {

    @ConfigProperty(name = "keycloak-realm")
    String realm;

    @ConfigProperty(name = "keycloak-client_secret")
    String clientSecret;

    @ConfigProperty(name = "keycloak-client_id")
    String clientId;

    @ConfigProperty(name = "quarkus.oidc.auth-server-url")
    String authServer;


    public Response exchangeToken(String payload) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost request = new HttpPost(authServer + "/protocol/openid-connect/token");
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

}

