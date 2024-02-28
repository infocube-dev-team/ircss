
package org.fhir.auth;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import io.restassured.common.mapper.TypeRef;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import jakarta.inject.Inject;
import org.apache.http.HttpStatus;
import org.eclipse.microprofile.config.ConfigProvider;
import org.fhir.auth.irccs.entity.User;
import org.hl7.fhir.r5.model.Bundle;
import org.hl7.fhir.r5.model.Practitioner;
import org.junit.jupiter.api.*;
import org.keycloak.Config;
import org.keycloak.representations.idm.UserRepresentation;
import org.quarkus.irccs.client.restclient.FhirClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserTest {
    @Inject
    FhirClient<Practitioner> practitionerFhirClient;

    @Test
    @Order(1)
    public void UserSignsup() {
        String url =
            ConfigProvider.getConfig()
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

        Map<String, String> params = new HashMap<>(){{
            put("username", user.getEmail());
            put("password", user.getPassword());
            put("grant_type", "password");
            put("client_id", "irccs");
            put("client_secret", "cwvB6qAn5iFl7pa9r04WxkordJyy3tjS");
        }};

        // Un-enabled User tries to login, expected: BAD REQUEST
        RestAssured
                .given()
                .contentType(ContentType.URLENC)
                .formParams(params)
                .when()
                .post("http://localhost:9445/realms/pascale/protocol/openid-connect/token")
                .then()
                .statusCode(HttpStatus.SC_BAD_REQUEST)
                .extract().response();

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
                .contentType("application/json")
                .when()
                .post("/fhir/auth/users/enable?email=" + resCreate.getEmail())
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(User.class);

        Thread.sleep(3000);

        Response createdPractitionerRes = RestAssured
                .given()
                .contentType("application/json")
                .when()
                .get("http://localhost:8080/fhir/Practitioner?email=" + resCreate.getEmail())
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();

        Bundle createdPractitioner = practitionerFhirClient.parseResource(Bundle.class, createdPractitionerRes.getBody().asPrettyString());

        Assertions.assertEquals(createdPractitioner.getEntry().size(), 1);


        System.out.println("Specular Practitioner successfully created!");
    }

    @Test
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
                .contentType("application/json")
                .when()
                .post("/fhir/auth/users/enable?email=" + resCreate.getEmail())
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(User.class);

        Thread.sleep(3000);

        Response createdPractitionerRes = RestAssured
                .given()
                .contentType("application/json")
                .when()
                .get("http://localhost:8080/fhir/Practitioner?email=" + resCreate.getEmail())
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
                .post("http://localhost:9445/realms/pascale/protocol/openid-connect/token")
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
                .contentType("application/json")
                .when()
                .get("/fhir/auth/users")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(new TypeRef<List<User>>(){});

        for(User user : users){
            if(!user.getEmail().equals("pascale@admin.it")){
                RestAssured
                        .given()
                        .contentType("application/json")
                        .when()
                        .delete("/fhir/auth/users?email=" + user.getEmail())
                        .then()
                        .statusCode(HttpStatus.SC_OK);
            }
        }

        users = RestAssured
                .given()
                .contentType("application/json")
                .when()
                .get("/fhir/auth/users")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(new TypeRef<List<User>>(){});

        Assertions.assertEquals(1, users.size());

        System.out.println("Keycloak users & FHIR Practitioners successfully deleted!");
    }

}
