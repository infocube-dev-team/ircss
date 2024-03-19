
package org.fhir.auth;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import io.restassured.common.mapper.TypeRef;
import io.restassured.http.ContentType;
import io.restassured.parsing.Parser;
import org.apache.http.HttpStatus;
import org.eclipse.microprofile.config.ConfigProvider;
import org.fhir.auth.irccs.entity.Group;
import org.fhir.auth.irccs.entity.User;
import org.junit.jupiter.api.*;
import org.keycloak.representations.AccessTokenResponse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class GroupTest {

    static {
        RestAssured.defaultParser = Parser.JSON;
    }


    @Test
    @Order(1)
    public void getAllAdmins() throws InterruptedException {

        Group group = RestAssured
                .given()
                .header("Authorization", getAdminAccessToken())
                .contentType("application/json")
                .when()
                .get("/fhir/auth/groups?name=admin")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(new TypeRef<>() {
                });

        List<User> users = new ArrayList<>();

            for( String groupMember : group.getMembers() ){
                users.add(RestAssured
                        .given()
                        .header("Authorization", getAdminAccessToken())
                        .contentType("application/json")
                        .when()
                        .get("/fhir/auth/users?email=" + groupMember)
                        .then()
                        .statusCode(HttpStatus.SC_OK)
                        .extract().response().as(new TypeRef<>() {
                        }));
            }

        System.out.println(users.size() + " admins found!");

        User admin = users.get(0);

        User resEnable = RestAssured
                .given()
                .header("Authorization", getAccessToken(admin.getEmail(), getAdminPassword()))
                .contentType("application/json")
                .when()
                .post("/fhir/auth/users/enable?email=" + admin.getEmail())
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(User.class);

        System.out.println(resEnable);

        Thread.sleep(3000);

        Group groupBody = new Group();
        ArrayList<String> members = new ArrayList<>();
        members.add(admin.getEmail());
        ArrayList<String> organizations = new ArrayList<>();
        organizations.add("organizations");

        groupBody.setName("Users");
        groupBody.setMembers(members);
        groupBody.setOrganizations(organizations);
        Group resGroups = RestAssured
                .given()
                .header("Authorization", getAccessToken(admin.getEmail(), getAdminPassword()))
                .contentType("application/json")
                .body(groupBody)
                .when()
                .post("/fhir/auth/groups")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(Group.class);

        Assertions.assertEquals(resGroups.getName(), groupBody.getName());
        Assertions.assertEquals(resGroups.getOrganizations(), groupBody.getOrganizations());
        Assertions.assertEquals(resGroups.getMembers(), groupBody.getMembers());

        System.out.println(resGroups.getName() + " group with id:" + resGroups.getId() + " successfully created!");

        organizations.add("prova");
        resGroups.setOrganizations(organizations);

        Group resGroupChanged = RestAssured
                .given()
                .header("Authorization", getAccessToken(admin.getEmail(), getAdminPassword()))
                .contentType("application/json")
                .body(resGroups)
                .when()
                .put("/fhir/auth/groups")
                .then()
                .statusCode(HttpStatus.SC_ACCEPTED)
                .extract().response().as(Group.class);

        Assertions.assertEquals(resGroups.getName(), resGroupChanged.getName());
        Assertions.assertEquals(resGroups.getOrganizations(), organizations);
        Assertions.assertEquals(resGroups.getMembers(), resGroupChanged.getMembers());

        System.out.println(resGroups.getName() + " group name successfully changed to: " + resGroupChanged.getName() + "!");

        List<Group> groups = RestAssured
                .given()
                .header("Authorization", getAccessToken(admin.getEmail(), getAdminPassword()))
                .contentType("application/json")
                .when()
                .get("/fhir/auth/groups")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(new TypeRef<>() {
                });

        Assertions.assertEquals(2, groups.size());

        System.out.println("Groups successfully retrieved");
        System.out.println("Groups size: " + groups.size() + "!");

        RestAssured
                .given()
                .header("Authorization", getAccessToken(admin.getEmail(), getAdminPassword()))
                .contentType("application/json")
                .when()
                .delete("/fhir/auth/groups?name=" + resGroupChanged.getName())
                .then()
                .statusCode(HttpStatus.SC_OK);

        groups = RestAssured
                .given()
                .header("Authorization", getAccessToken(admin.getEmail(), getAdminPassword()))
                .contentType("application/json")
                .when()
                .get("/fhir/auth/groups")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response().as(new TypeRef<>() {
                });

        Assertions.assertEquals(1, groups.size());

        System.out.println("Groups size: " + groups.size() + "!");
        System.out.println("Group successfully deleted!");

    }

    public static String getAdminAccessToken() {
        String token =  RestAssured
                .given()
                .auth()
                .preemptive()
                .basic(getClientId(), getClientSecret())
                .formParam("grant_type", "password")
                .formParam("username", getAdminUsername())
                .formParam("password", getAdminPassword())
                .when()
                .post("/fhir/auth/users")
                .then()
                .extract()
                .asString();
        return "Bearer " + token;
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

    public static String getAccessToken(String username, String password) {

        String token = RestAssured
                .given()
                .auth()
                .preemptive()
                .basic(getClientId(), getClientSecret())
                .formParam("grant_type", "password")
                .formParam("username", username)
                .formParam("password", password)
                .when()
                .post("/fhir/auth/users")
                .then()
                .extract()
                .asString();

        return "Bearer " + token;

    }

}
