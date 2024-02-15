
package org.fhir.auth;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.apache.http.HttpStatus;
import org.fhir.auth.irccs.entity.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.keycloak.representations.idm.UserRepresentation;

@QuarkusTest
public class UserTest {
    @Test
    public void testUserCRUD() {
        User mick = new User();
        mick.setEmail("m.marrandino@infocube.it");
        mick.setName("Michele");
        mick.setSurname("Marrandino");
        mick.setPassword("Kloss2001!!");
        mick.setPhoneNumber("123456789");
        Response responseCreate = RestAssured
                .given()
                .contentType("application/fhir+json")
                .body(mick)
                .when()
                .post("/fhir/auth/users")
                .then()
                .statusCode(HttpStatus.SC_CREATED)
                .extract().response();

        System.out.println("--------POST----------");
        System.out.println(responseCreate.prettyPrint());
        Response responseGet = RestAssured
                .given()
                .contentType("application/fhir+json")
                .when()
                .get("/fhir/auth/users?email=m.marrandino@infocube.it")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();

        System.out.println("--------GET----------");
        System.out.println(responseGet.prettyPrint());
        UserRepresentation mikeur = responseGet.as(UserRepresentation.class);

        Assertions.assertNotNull(mikeur);
        Assertions.assertEquals("m.marrandino@infocube.it",mikeur.getEmail());
        Assertions.assertEquals("123456789",mikeur.getAttributes().get("phoneNumber").get(0));

        System.out.println("--------ID----------");
        System.out.println(mikeur.getId());
        System.out.println("------------------");

        mick.setPhoneNumber("999000");
        Response responsePut = RestAssured
                .given()
                .contentType("application/fhir+json")
                .body(mick)
                .when()
                .put("/fhir/auth/users?email=m.marrandino@infocube.it")
                .then()
                .statusCode(HttpStatus.SC_ACCEPTED)
                .extract().response();

        System.out.println("------PUT------------");
        System.out.println(responsePut.prettyPrint());

        responseGet = RestAssured
                .given()
                .contentType("application/fhir+json")
                .when()
                .get("/fhir/auth/users?email=m.marrandino@infocube.it")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();

        UserRepresentation mikeur2 = responseGet.as(UserRepresentation.class);
        Assertions.assertNotNull(mikeur2);
        Assertions.assertEquals("m.marrandino@infocube.it",mikeur2.getEmail());
        Assertions.assertEquals("999000",mikeur2.getAttributes().get("phoneNumber").get(0));
        Assertions.assertEquals(mikeur.getId(),mikeur2.getId());

        System.out.println("--------GET----------");
        System.out.println(responseGet.prettyPrint());

        Response response = RestAssured
                .given()
                .contentType("application/fhir+json")
                .when()
                .delete("/fhir/auth/users?email=m.marrandino@infocube.it")
                .then()
                .statusCode(HttpStatus.SC_OK)
                .extract().response();

        System.out.println("--------DELETE----------");
        System.out.println(response.prettyPrint());
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

}
