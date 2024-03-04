
package org.fhir.auth;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import io.restassured.common.mapper.TypeRef;
import io.restassured.http.ContentType;
import io.restassured.parsing.Parser;
import io.restassured.response.Response;
import jakarta.inject.Inject;
import org.apache.http.HttpStatus;
import org.eclipse.microprofile.config.ConfigProvider;
import org.fhir.auth.irccs.entity.Group;
import org.fhir.auth.irccs.entity.User;
import org.hl7.fhir.r5.model.Bundle;
import org.hl7.fhir.r5.model.Practitioner;
import org.junit.jupiter.api.*;
import org.keycloak.representations.AccessTokenResponse;
import org.keycloak.representations.idm.GroupRepresentation;
import org.quarkus.irccs.client.restclient.FhirClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserTest {
    @Inject
    FhirClient<Practitioner> practitionerFhirClient;

    static {
        RestAssured.defaultParser = Parser.JSON;
    }

    @Test
    @Order(1)
    public void UserSignsup() {
        String devenabled = ConfigProvider.getConfig().getConfigValue("quarkus.devservices.enabled").getValue();
        System.err.println(devenabled);
        String url = ConfigProvider.getConfig()
                .getConfigValue("quarkus.keycloak.policy-enforcer.paths.0.path")
                .getValue();

        System.err.println(url);
        String enforce =
                ConfigProvider.getConfig()
                        .getConfigValue("quarkus.keycloak.policy-enforcer.paths.0.enforcement-mode")
                        .getValue();
        System.err.println(enforce);

        // Testing what happens when a new Keycloak User signs up.
        User user = new User();
        user.setEmail("jhondoe1@gmail.com");
        user.setPhoneNumber("+393388888888");
        user.setName("Jhon");
        user.setSurname("Doe");
        user.setPassword("JhonDoe123");

        User res = RestAssured
                .given()
                .contentType("application/json")
                .body(user)
                .when()
                .post("/fhir/auth/users/signup")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(User.class);

        Assertions.assertEquals(res.getEmail(), user.getEmail());
        Assertions.assertEquals(res.getPhoneNumber(), user.getPhoneNumber());
        Assertions.assertEquals(res.getName(), user.getName());
        Assertions.assertEquals(res.getSurname(), user.getSurname());
        Assertions.assertEquals(res.getEnabled(), false);

        System.out.println("User successfully created! " + res.getEmail());
    }

    @Test
    @Order(2)
    public void unenabledUserLogsin() {
        // Testing what happens when a new Keycloak User logs in (Not yet enabled).
        User user = new User();
        user.setEmail("jhondoe2@gmail.com");
        user.setPhoneNumber("+393388888888");
        user.setName("Jhon");
        user.setSurname("Doe");
        user.setPassword("JhonDoe123");

        User res = RestAssured
                .given()
                .contentType("application/json")
                .body(user)
                .when()
                .post("/fhir/auth/users/signup")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(User.class);

        Assertions.assertEquals(res.getEmail(), user.getEmail());
        Assertions.assertEquals(res.getPhoneNumber(), user.getPhoneNumber());
        Assertions.assertEquals(res.getName(), user.getName());
        Assertions.assertEquals(res.getSurname(), user.getSurname());
        Assertions.assertEquals(res.getEnabled(), false);

        System.out.println("User successfully created! " + res.getEmail());

        // Un-enabled User tries to login, expected: BAD REQUEST
        Assertions.assertNull(getAccessToken("jhondoe2@gmail.com", "JhonDoe123"));

        System.out.println("User couldn't rightfully log in! " + user.getEmail());
    }

    @Test
    @Order(3)
    public void UserGetsEnabled() throws InterruptedException {
        // Testing what happens when a User gets enabled.
        User user = new User();
        user.setEmail("jhondoe3@gmail.com");
        user.setPhoneNumber("+393388888888");
        user.setName("Jhon");
        user.setSurname("Doe");
        user.setPassword("JhonDoe123");

        User resCreate = RestAssured
                .given()
                .contentType("application/json")
                .body(user)
                .when()
                .post("/fhir/auth/users/signup")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(User.class);

        Assertions.assertEquals(resCreate.getEmail(), user.getEmail());
        Assertions.assertEquals(resCreate.getPhoneNumber(), user.getPhoneNumber());
        Assertions.assertEquals(resCreate.getName(), user.getName());
        Assertions.assertEquals(resCreate.getSurname(), user.getSurname());
        Assertions.assertEquals(resCreate.getEnabled(), false);

        System.out.println("User successfully created! " + resCreate.getEmail());

        // Enabling Keycloak user and creating specular Practitioner resource on FHIR.
        User resEnable = RestAssured
                .given()
                .auth()
                .oauth2(getAdminAccessToken())
                .contentType("application/json")
                .when()
                .post("/fhir/auth/users/enable?email=" + resCreate.getEmail())
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(User.class);

        System.out.println(resEnable);

        Thread.sleep(3000);

        Response createdPractitionerRes = RestAssured
                .given()
                .contentType("application/json")
                .when()
                .get(getFhirUrl() + "/Practitioner?email=" + resCreate.getEmail())
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();

        Bundle createdPractitioner = practitionerFhirClient.parseResource(Bundle.class, createdPractitionerRes.getBody().asPrettyString());

        Assertions.assertEquals(createdPractitioner.getEntry().size(), 1);


        System.out.println("Specular Practitioner successfully created!");
    }

    @Order(4)
    public void EnabledUserLogsin() throws InterruptedException {
        // Testing what happens when a new Keycloak User logs in (enabled).
        User user = new User();
        user.setEmail("jhondoe4@gmail.com");
        user.setPhoneNumber("+393388888888");
        user.setName("Jhon");
        user.setSurname("Doe");
        user.setPassword("JhonDoe123");

        User resCreate = RestAssured
                .given()
                .contentType("application/json")
                .body(user)
                .when()
                .post("/fhir/auth/users/signup")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(User.class);

        Assertions.assertEquals(resCreate.getEmail(), user.getEmail());
        Assertions.assertEquals(resCreate.getPhoneNumber(), user.getPhoneNumber());
        Assertions.assertEquals(resCreate.getName(), user.getName());
        Assertions.assertEquals(resCreate.getSurname(), user.getSurname());
        Assertions.assertEquals(resCreate.getEnabled(), false);

        System.out.println("User successfully created! " + resCreate.getEmail());

        // Enabling Keycloak user and creating specular Practitioner resource on FHIR.
        User resEnable = RestAssured
                .given()
                .auth()
                .oauth2(getAdminAccessToken())
                .contentType("application/json")
                .when()
                .post("/fhir/auth/users/enable?email=" + resCreate.getEmail())
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(User.class);

        System.out.println(resEnable);
        Thread.sleep(3000);

        Response createdPractitionerRes = RestAssured
                .given()
                .contentType("application/json")
                .when()
                .get(getFhirUrl() + "/Practitioner?email=" + resCreate.getEmail())
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();

        Bundle createdPractitioner = practitionerFhirClient.parseResource(Bundle.class, createdPractitionerRes.getBody().asPrettyString());

        Assertions.assertEquals(createdPractitioner.getEntry().size(), 1);


        System.out.println("Specular Practitioner successfully created!");

        Map<String, String> params = new HashMap<>(){{
            put("username", user.getEmail());
            put("password", user.getPassword());
            put("grant_type", "password");
            put("client_id", "irccs");
            put("client_secret", "cwvB6qAn5iFl7pa9r04WxkordJyy3tjS");
        }};

        // enabled User tries to login, expected: OK
        RestAssured
                .given()
                .contentType(ContentType.URLENC)
                .formParams(params)
                .when()
                .post(getKeycloakUrl() + "/realms/" + getKeycloakRealm() + "/protocol/openid-connect/token")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();


        System.out.println("User logged in! " + user.getEmail());
    }

    @Test
    @Order(5)
    public void UsersGetAndDelete() {
        List<User> users = RestAssured
                .given()
                .auth()
                .oauth2(getAdminAccessToken())
                .contentType("application/json")
                .when()
                .get("/fhir/auth/users")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(new TypeRef<>() {
                });

        for(User user : users){
            if(!user.getEmail().equals("pascale@admin.it")){
                RestAssured
                        .given()
                        .auth()
                        .oauth2(getAdminAccessToken())
                        .contentType("application/json")
                        .when()
                        .delete("/fhir/auth/users?email=" + user.getEmail())
                        .then()
                        .statusCode(HttpStatus.SC_OK);
            }
        }

        users = RestAssured
                .given()
                .auth()
                .oauth2(getAdminAccessToken())
                .contentType("application/json")
                .when()
                .get("/fhir/auth/users")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(new TypeRef<>() {
                });

        Assertions.assertEquals(1, users.size());

        System.out.println("Keycloak users & FHIR Practitioners successfully deleted!");
    }

    @Test
    @Order(6)
    public void UserSignUp() {
        // Testing what happens when a new Keycloak User signs up.
        User user = new User();
        user.setEmail("francescototti@gmail.com");
        user.setPhoneNumber("+391010101010");
        user.setName("Francesco");
        user.setSurname("Totti");
        user.setPassword("FrancescoTotti10");

        User res = RestAssured
                .given()
                .contentType("application/json")
                .body(user)
                .when()
                .post("/fhir/auth/users/signup")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(User.class);

        Assertions.assertEquals(res.getEmail(), user.getEmail());
        Assertions.assertEquals(res.getPhoneNumber(), user.getPhoneNumber());
        Assertions.assertEquals(res.getName(), user.getName());
        Assertions.assertEquals(res.getSurname(), user.getSurname());
        Assertions.assertEquals(res.getEnabled(), false);

        System.out.println("User successfully created! " + res.getEmail());
    }

    @Test
    @Order(7)
    public void UserCheck() {
        User user = new User();
        user.setEmail("francescototti@gmail.com");
        user.setPhoneNumber("+391010101010");
        user.setName("Francesco");
        user.setSurname("Totti");
        user.setPassword("FrancescoTotti10");

        User res = RestAssured
                .given()
                .auth()
                .oauth2(getAdminAccessToken())
                .contentType("application/json")
                .when()
                .get("/fhir/auth/users?email=francescototti@gmail.com")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(new TypeRef<>() {
                });

        Assertions.assertEquals(res.getEmail(), user.getEmail());

        System.out.println("User " + res.getEmail() + " successfully found!");
    }

    @Test
    @Order(8)
    public void getAllAdmins() {

        List<Group> groups = RestAssured
                .given()
                .auth()
                .oauth2(getAdminAccessToken())
                .contentType("application/json")
                .when()
                .get("/fhir/auth/groups?name=admin")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(new TypeRef<>() {
                });

        List<User> users = new ArrayList<User>();

        if(groups.size() == 1){
            for( String groupMember : groups.get(0).getMembers() ){
                users.add(RestAssured
                        .given()
                        .auth()
                        .oauth2(getAdminAccessToken())
                        .contentType("application/json")
                        .when()
                        .get("/fhir/auth/users?email=" + groupMember)
                        .then()
                        .statusCode(HttpStatus.SC_OK)
                        .extract().response().as(new TypeRef<>() {
                        }));
            }
        }

        System.out.println(users.size() + " admins found!");

    }

    public static String getAdminAccessToken() {
        Map<String, String> params = new HashMap<>(){{
            put("username", getAdminUsername());
            put("password", getAdminPassword());
            put("grant_type", "password");
            put("client_id", getClientId());
            put("client_secret", getClientSecret());
        }};

        return RestAssured
                .given()
                .contentType(ContentType.URLENC)
                .formParams(params)
                .when()
                .post(getKeycloakUrl() + "/realms/" + getKeycloakRealm() + "/protocol/openid-connect/token")
                .then().extract().response()
                .as(AccessTokenResponse.class).getToken();
    }

    private static String getKeycloakUrl(){
        return ConfigProvider.getConfig().getConfigValue("keycloak-url").getValue();
    }

    private static String getClientId(){
        return ConfigProvider.getConfig().getConfigValue("keycloak-client_id").getValue();
    }

    private static String getClientSecret(){
        return ConfigProvider.getConfig().getConfigValue("keycloak-client_secret").getValue();
    }

    private static String getAdminUsername(){
        return ConfigProvider.getConfig().getConfigValue("keycloak-admin-username").getValue();
    }

    private static String getAdminPassword(){
        return ConfigProvider.getConfig().getConfigValue("keycloak-admin-password").getValue();
    }

    private static String getKeycloakRealm(){
        return ConfigProvider.getConfig().getConfigValue("keycloak-realm").getValue();
    }
    private static String getFhirUrl(){
        System.out.println(ConfigProvider.getConfig().getConfigValue("org.quarkus.irccs.fhir-server").getValue());
        return ConfigProvider.getConfig().getConfigValue("org.quarkus.irccs.fhir-server").getValue();
    }

    public static String getAccessToken(String username, String password) {
        Map<String, String> params = new HashMap<>(){{
            put("username", username);
            put("password", password);
            put("grant_type", "password");
            put("client_id", getClientId());
            put("client_secret", getClientSecret());
        }};

        return RestAssured
                .given()
                .contentType(ContentType.URLENC)
                .formParams(params)
                .when()
                .post(getKeycloakUrl() + "/realms/" + getKeycloakRealm() + "/protocol/openid-connect/token")
                .then().extract().response()
                .as(AccessTokenResponse.class).getToken();
    }

}
