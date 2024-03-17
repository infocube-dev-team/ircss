
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
                .auth()
                .oauth2(getAdminAccessToken())
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

        System.out.println(users.size() + " admins found!");

        User admin = users.get(0);

        User resEnable = RestAssured
                .given()
                .auth()
                .oauth2(getAccessToken(admin.getEmail(),getAdminPassword()))
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
                .auth()
                .oauth2(getAccessToken(admin.getEmail(),getAdminPassword()))
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
                .auth()
                .oauth2(getAccessToken(admin.getEmail(),getAdminPassword()))
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
                .auth()
                .oauth2(getAccessToken(admin.getEmail(),getAdminPassword()))
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
                .auth()
                .oauth2(getAccessToken(admin.getEmail(),getAdminPassword()))
                .contentType("application/json")
                .when()
                .delete("/fhir/auth/groups?name=" + resGroupChanged.getName())
                .then()
                .statusCode(HttpStatus.SC_OK);

        groups = RestAssured
                .given()
                .auth()
                .oauth2(getAccessToken(admin.getEmail(),getAdminPassword()))
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
                //.post(getKeycloakUrl() + "/realms/" + getKeycloakRealm() + "/protocol/openid-connect/token")
                .post(getKeycloakUrl() + "/realms/" + getKeycloakRealm() + "/protocol/openid-connect/token")
                .then().extract().response()
                .as(AccessTokenResponse.class).getToken();
    }

}
