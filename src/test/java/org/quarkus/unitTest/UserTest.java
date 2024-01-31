package org.quarkus.unitTest;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.apache.http.HttpStatus;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.quarkus.assembler.GroupBuilder;
import org.quarkus.assembler.ProfileBuilder;
import org.quarkus.assembler.UserBuilder;
import org.quarkus.entity.FhirProfile;
import org.quarkus.entity.Method;
import org.quarkus.entity.ResourceType;

import java.util.Arrays;
import java.util.List;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserTest {

    public static Integer userA;
    public static Integer userB;
    public static Integer groupA;
    public static Integer groupB;
    public static Integer profileA;
    public static Integer profileB;
    public static FhirProfile medici;
    public static FhirProfile tirocinanti;

    @Test
    @Order(1)
    public void testUserACreate() {
        Response response = RestAssured
                .given()
                .contentType("application/json")
                .body(new UserBuilder("Mario", "Rossi").build().encode())
                .when()
                .post("/users")
                .then()
                .statusCode(HttpStatus.SC_NO_CONTENT)
                .extract().response();

        System.out.println(response.prettyPrint());
    }

    @Test
    @Order(2)
    public void testUserAGet() {
        Response response = RestAssured.given()
                .contentType("application/json")
                .when()
                .get("/users")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();

        List<Integer> userIdList = response.jsonPath().getList("id");
        userA = userIdList.get(userIdList.size() - 1);
        System.out.println(userA);
    }

    @Test
    @Order(3)
    public void testUserAPut() {
        RestAssured.given()
                .contentType("application/json")
                .body(new UserBuilder("Mario", "Bianchi").build().encode())
                .when()
                .put("/users/" + userA)
                .then()
                .statusCode(HttpStatus.SC_NO_CONTENT)
                .extract().response();
    }

    @Test
    @Order(4)
    public void testUserAEditedGet() {
        Response response = RestAssured.given()
                .contentType("application/json")
                .when()
                .get("/users/" + userA)
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();

        assert(response.asString().equals(new UserBuilder("Mario", "Bianchi").withId(userA).build().encode()));
    }

    @Test
    @Order(5)
    public void testUserBCreate() {
        Response response = RestAssured
                .given()
                .contentType("application/json")
                .body(new UserBuilder("Giovanni", "Bianchi").build().encode())
                .when()
                .post("/users")
                .then()
                .statusCode(HttpStatus.SC_NO_CONTENT)
                .extract().response();

        System.out.println(response.prettyPrint());
    }

    @Test
    @Order(6)
    public void testUserBGet() {
        Response response = RestAssured.given()
                .contentType("application/json")
                .when()
                .get("/users")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();

        List<Integer> userIdList = response.jsonPath().getList("id");
        userB = userIdList.get(userIdList.size() - 1);
        System.out.println(userB);
    }

    @Test
    @Order(7)
    public void testGroupMediciCreate() {
        Response response = RestAssured
                .given()
                .contentType("application/json")
                .body(new GroupBuilder("Medici", List.of(UserTest.userA, UserTest.userB)).build().encode())
                .when()
                .post("/groups")
                .then()
                .statusCode(HttpStatus.SC_NO_CONTENT)
                .extract().response();
    }

    @Test
    @Order(8)
    public void testGroupMediciGet() {
        Response response = RestAssured.given()
                .contentType("application/json")
                .when()
                .get("/groups")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();

        List<Integer> groupIdList = response.jsonPath().getList("id");
        groupA = groupIdList.get(groupIdList.size() - 1);
        System.out.println(groupA);
    }

    @Test
    @Order(9)
    public void testGroupTirocinantiCreate() {
         RestAssured
                .given()
                .contentType("application/json")
                .body(new GroupBuilder("Medici", List.of(UserTest.userA)).build().encode())
                .when()
                .post("/groups")
                .then()
                .statusCode(HttpStatus.SC_NO_CONTENT)
                .extract().response();
    }

    @Test
    @Order(10)
    public void testGroupTirocinantiGet() {
        Response response = RestAssured.given()
                .contentType("application/json")
                .when()
                .get("/groups")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();

        List<Integer> groupIdList = response.jsonPath().getList("id");
        groupB = groupIdList.get(groupIdList.size() - 1);
        System.out.println(groupB);
    }

    @Test
    @Order(11)
    public void testProfileMediciCreate() {
        medici = new ProfileBuilder(List.of(new ResourceType("Patient", List.of(new Method("create", "enabled"), new Method("read", "enabled"))))).buildProfile();


        RestAssured
                .given()
                .contentType("application/json")
                .body(new ProfileBuilder(medici).buildResourceTypes().encode())
                .when()
                .post("/profiles")
                .then()
                .statusCode(HttpStatus.SC_NO_CONTENT);
    }

    @Test
    @Order(12)
    public void testProfileMediciGet() {
        Response response = RestAssured.given()
                .contentType("application/json")
                .when()
                .get("/profiles")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();

        List<Integer> profileList = response.jsonPath().getList("id");
        profileA = profileList.get(profileList.size() - 1);
        System.out.println(profileA);
    }

    @Test
    @Order(13)
    public void testProfileTirocinantiCreate() {
        tirocinanti = new ProfileBuilder(List.of(new ResourceType("Patient", List.of(new Method("create", "enabled"), new Method("read", "enabled"))))).buildProfile();
        RestAssured
                .given()
                .contentType("application/json")
                .body(new ProfileBuilder(tirocinanti).buildResourceTypes().encode())
                .when()
                .post("/profiles")
                .then()
                .statusCode(HttpStatus.SC_NO_CONTENT);
    }

    @Test
    @Order(14)
    public void testProfileTirocinantiGet() {
        Response response = RestAssured.given()
                .contentType("application/json")
                .when()
                .get("/profiles")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();

        List<Integer> profileList = response.jsonPath().getList("id");
        profileB = profileList.get(profileList.size() - 1);
        System.out.println(profileB);
    }

    @Test
    @Order(15)
    public void testAssociationProfileMediciToGroup() {
        RestAssured.given()
                .contentType("application/json")
                .when()
                .post("/groups/" + groupA + "/profiles/" + profileA)
                .then()
                .statusCode(HttpStatus.SC_NO_CONTENT);
    }

    @Test
    @Order(16)
    public void testAssociationProfileTirocinantiToGroup() {
        RestAssured.given()
                .contentType("application/json")
                .when()
                .post("/groups/" + groupB + "/profiles/" + profileB)
                .then()
                .statusCode(HttpStatus.SC_NO_CONTENT);
    }

    @Test
    @Order(17)
    public void testAssociationProfileTirocinantiToGroupGet() {
        Response response = RestAssured.given()
                .contentType("application/json")
                .when()
                .get("/groups")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();

        System.out.println(Arrays.equals(response.jsonPath().getList("fhirProfile.resourceTypes").toArray(), new Object[]{new ProfileBuilder(medici).buildResourceTypes().getList().toArray(), new ProfileBuilder(tirocinanti).buildResourceTypes().getList().toArray()}));
    }

    @Test
    @Order(18)
    public void testCRUDPerson() {
        // 1. add a Person to FHIR
        // 2. add Person to LDAP
        // 3. Update Person to FHIR
        // 4. Read Person
        // 5. Delete Person to FHIR & LDAP
    }

    @Test
    @Order(19)
    public void testCRUDGroup() {
        // 1. add a Group to FHIR
        // 2. add Group to LDAP
        // 3. Update Group to FHIR
        // 4. Read Group
        // 5. Delete Group to FHIR & LDAP
    }

    @Test
    @Order(20)
    public void testPermissionToGroup() {
        // 1. Add Group Ex. TestPractitioner
        // 2. Add Permission Ex.  /Practitioner.crved
        // 3. Add Permission Ex.  /ResearchStudy.r
        // 4. Add Permission 1 to Group 1.
        // 5. Add Permission 2 to Group 1.
            // 1. Get Group 1 (and Linked Permissions)
            // 2. Get Group 2 (and Linked Permissions)
    }

    @Test
    @Order(21)
    public void testAddUserGroup() {
        // 1. Create a Group
        // 2. Create Person -Fhir- (And user to LDAP)
        // 3. Add person to group (LDAP only)
    }

    @Test
    @Order(22)
    public void testRemoveUserGroup() {
        // 1. Create a Group
        // 2. Create Person -Fhir- (And user to LDAP)
        // 3. Add person to group (LDAP only)
    }

    @Test
    @Order(23)
    public void testGetJWT() {
        // 1. Create Group
        // 2. ... (Base)
        // 3. Get Token from group (Scope: List of Group and Permissions, Context: *)
    }



}