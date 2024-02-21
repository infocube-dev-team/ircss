
package org.fhir.auth;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import io.restassured.common.mapper.TypeRef;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import jakarta.inject.Inject;
import org.apache.http.HttpStatus;
import org.fhir.auth.irccs.entity.User;
import org.fhir.auth.irccs.service.UserService;
import org.hl7.fhir.r5.model.ContactPoint;
import org.hl7.fhir.r5.model.Practitioner;
import org.junit.jupiter.api.*;
import org.keycloak.representations.idm.UserRepresentation;
import org.quarkus.irccs.client.restclient.FhirClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
        // Testing what happens when a new Keycloak User signs up.
        User user = new User();
        user.setEmail("jhondoe1@gmail.com");
        user.setPhoneNumber("+393388888888");
        user.setName("Jhon");
        user.setSurname("Doe");
        user.setPassword("JhonDoe123");

        UserRepresentation res = RestAssured
                .given()
                .contentType("application/json")
                .body(user)
                .when()
                .post("/fhir/auth/users")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(UserRepresentation.class);

        Assertions.assertEquals(res.getEmail(), user.getEmail());
        Assertions.assertEquals(res.getAttributes().get("phoneNumber").get(0), user.getPhoneNumber());
        Assertions.assertEquals(res.getFirstName(), user.getName());
        Assertions.assertEquals(res.getLastName(), user.getSurname());
        Assertions.assertEquals(res.isEnabled(), false);

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

        UserRepresentation res = RestAssured
                .given()
                .contentType("application/json")
                .body(user)
                .when()
                .post("/fhir/auth/users")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(UserRepresentation.class);

        Assertions.assertEquals(res.getEmail(), user.getEmail());
        Assertions.assertEquals(res.getAttributes().get("phoneNumber").get(0), user.getPhoneNumber());
        Assertions.assertEquals(res.getFirstName(), user.getName());
        Assertions.assertEquals(res.getLastName(), user.getSurname());
        Assertions.assertEquals(res.isEnabled(), false);

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
    public void UserGetsEnabled() {
        // Testing what happens when a User gets enabled.
        User user = new User();
        user.setEmail("jhondoe3@gmail.com");
        user.setPhoneNumber("+393388888888");
        user.setName("Jhon");
        user.setSurname("Doe");
        user.setPassword("JhonDoe123");

        UserRepresentation resCreate = RestAssured
                .given()
                .contentType("application/json")
                .body(user)
                .when()
                .post("/fhir/auth/users")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(UserRepresentation.class);

        Assertions.assertEquals(resCreate.getEmail(), user.getEmail());
        Assertions.assertEquals(resCreate.getAttributes().get("phoneNumber").get(0), user.getPhoneNumber());
        Assertions.assertEquals(resCreate.getFirstName(), user.getName());
        Assertions.assertEquals(resCreate.getLastName(), user.getSurname());
        Assertions.assertEquals(false, resCreate.isEnabled());

        System.out.println("User successfully created! " + resCreate.getEmail());

        // Enabling Keycloak user and creating specular Practitioner resource on FHIR.
        Response resEnable = RestAssured
                .given()
                .contentType("application/json")
                .body(user)
                .when()
                .post("/fhir/auth/users/enable?email=" + resCreate.getEmail())
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();

        Practitioner practitioner = practitionerFhirClient.parseResource(Practitioner.class, resEnable.getBody().prettyPrint());

        // Practitioner is created, testing expectations.
        UserRepresentation resRead = RestAssured
                .given()
                .contentType("application/json")
                .when()
                .get("/fhir/auth/users?email=" + user.getEmail())
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(UserRepresentation.class);


        Assertions.assertEquals(resRead.getId(), practitioner.getIdentifier().get(0).getValue());
        Assertions.assertEquals(true, resRead.isEnabled());
        Assertions.assertEquals(resRead.getEmail(), practitioner.getTelecom().stream().filter(contact -> contact.getSystem().equals(ContactPoint.ContactPointSystem.EMAIL)).toList().get(0).getValue());
        Assertions.assertEquals(resRead.getAttributes().get("phoneNumber").get(0), practitioner.getTelecom().stream().filter(contact -> contact.getSystem().equals(ContactPoint.ContactPointSystem.PHONE)).toList().get(0).getValue());
        Assertions.assertEquals(resRead.getFirstName(), practitioner.getName().get(0).getText());
        Assertions.assertEquals(resRead.getLastName(), practitioner.getName().get(0).getFamily());

        System.out.println("Specular Practitioner successfully created! " + practitioner.getId());
    }

    @Test
    @Order(4)
    public void EnabledUserLogsin() {
        // Testing what happens when a new Keycloak User logs in (enabled).
        User user = new User();
        user.setEmail("jhondoe4@gmail.com");
        user.setPhoneNumber("+393388888888");
        user.setName("Jhon");
        user.setSurname("Doe");
        user.setPassword("JhonDoe123");

        UserRepresentation resCreate = RestAssured
                .given()
                .contentType("application/json")
                .body(user)
                .when()
                .post("/fhir/auth/users")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(UserRepresentation.class);

        Assertions.assertEquals(resCreate.getEmail(), user.getEmail());
        Assertions.assertEquals(resCreate.getAttributes().get("phoneNumber").get(0), user.getPhoneNumber());
        Assertions.assertEquals(resCreate.getFirstName(), user.getName());
        Assertions.assertEquals(resCreate.getLastName(), user.getSurname());
        Assertions.assertEquals(false, resCreate.isEnabled());

        System.out.println("User successfully created! " + resCreate.getEmail());

        // Enabling Keycloak user and creating specular Practitioner resource on FHIR.
        Response resEnable = RestAssured
                .given()
                .contentType("application/json")
                .body(user)
                .when()
                .post("/fhir/auth/users/enable?email=" + resCreate.getEmail())
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();

        Practitioner practitioner = practitionerFhirClient.parseResource(Practitioner.class, resEnable.getBody().prettyPrint());

        // Practitioner is created, testing expectations.

        UserRepresentation resRead = RestAssured
                .given()
                .contentType("application/json")
                .body(user)
                .when()
                .get("/fhir/auth/users?email=" + user.getEmail())
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(UserRepresentation.class);


        Assertions.assertEquals(resRead.getId(), practitioner.getIdentifier().get(0).getValue());
        Assertions.assertEquals(true, resRead.isEnabled());
        Assertions.assertEquals(resRead.getEmail(), practitioner.getTelecom().stream().filter(contact -> contact.getSystem().equals(ContactPoint.ContactPointSystem.EMAIL)).toList().get(0).getValue());
        Assertions.assertEquals(resRead.getAttributes().get("phoneNumber").get(0), practitioner.getTelecom().stream().filter(contact -> contact.getSystem().equals(ContactPoint.ContactPointSystem.PHONE)).toList().get(0).getValue());
        Assertions.assertEquals(resRead.getFirstName(), practitioner.getName().get(0).getText());
        Assertions.assertEquals(resRead.getLastName(), practitioner.getName().get(0).getFamily());

        System.out.println("Specular Practitioner successfully created! " + practitioner.getId());

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
        List<UserRepresentation> users = RestAssured
                .given()
                .contentType("application/json")
                .when()
                .get("/fhir/auth/users")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(new TypeRef<List<UserRepresentation>>(){});

        for(UserRepresentation user : users){
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
                .extract().response().as(new TypeRef<List<UserRepresentation>>(){});

        Assertions.assertEquals(1, users.size());

        System.out.println("Keycloak users & FHIR Practitioners successfully deleted!");
    }

}
