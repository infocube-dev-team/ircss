
package org.fhir.auth;

import org.apache.http.HttpStatus;
import org.fhir.auth.entity.User;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import io.restassured.response.Response;

@QuarkusTest
public class UserTest {

    @Test
    @Disabled
    public void testUserDelete() {
        Response response = RestAssured
                .given()
                .contentType("application/fhir+json")
                .when()
                .delete("/fhir/auth/users?email=m.marrandino@infocube.it")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();

        System.out.println(response.prettyPrint());
    }
    @Test
    public void testUserCreate() {
        User mick = new User();
        mick.setEmail("m.marrandino@infocube.it");
        mick.setName("Michele");
        mick.setSurname("Marrandino");
        mick.setPassword("Kloss2001!!");
        mick.setPhoneNumber("123456789");
        Response response = RestAssured
                .given()
                .contentType("application/fhir+json")
                .body(mick)
                .when()
                .post("/fhir/auth/users")
                .then()
                .statusCode(HttpStatus.SC_NO_CONTENT)
                .extract().response();

        System.out.println(response.prettyPrint());
    }

    /*
    @Test
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
    public void testCRUDPractitioner() {
        Practitioner practitioner = new Practitioner();
        practitioner.setId("Cazz008");
        userService.createUser(practitioner, "pass008!!##");
        userService.getUserById("Cazz008");

        // 2. add Person to LDAP
        // 3. Update Person to FHIR
        // 4. Read Person
        // 5. Delete Person to FHIR & LDAP
    }

    @Test
    public void testCRUDGroup() {
        // 1. add a Group to FHIR
        // 2. add Group to LDAP
        // 3. Update Group to FHIR
        // 4. Read Group
        // 5. Delete Group to FHIR & LDAP
    }

    @Test
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
    public void testAddUserGroup() {
        // 1. Create a Group
        // 2. Create Person -Fhir- (And user to LDAP)
        // 3. Add person to group (LDAP only)
    }

    @Test
    public void testRemoveUserGroup() {
        // 1. Create a Group
        // 2. Create Person -Fhir- (And user to LDAP)
        // 3. Add person to group (LDAP only)
    }

    @Test
    public void testGetJWT() {
        // 1. Create Group
        // 2. ... (Base)
        // 3. Get Token from group (Scope: List of Group and Permissions, Context: *)
    }

*/


}
