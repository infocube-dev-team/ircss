package org.fhir.auth.irccs.entity;


import lombok.Getter;
import lombok.Setter;
import org.hl7.fhir.instance.model.api.IIdType;
import org.hl7.fhir.r5.model.*;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.HashMap;
import java.util.List;


@Getter @Setter
public class User {
    private String id;
    private String name;
    private String surname;
    private String email;
    private String password;
    private String phoneNumber;
    private List<String> organizationRequest;

    public static UserRepresentation toUserRepresentation(User user){
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setUsername(user.getEmail());
        userRepresentation.setEmail(user.getEmail());
        userRepresentation.setEmailVerified(true);
        userRepresentation.setEnabled(false);
        userRepresentation.setFirstName(user.getName());
        userRepresentation.setLastName(user.getSurname());
        userRepresentation.setId(user.getId());
        userRepresentation.setAttributes(new HashMap<>(){{
            put("organizationRequest", user.getOrganizationRequest());
            put("phoneNumber", List.of(user.getPhoneNumber()));
        }});

        return userRepresentation;
    }

    public static Practitioner toPractitioner(User user){
        Practitioner practitioner = new Practitioner();
        practitioner
                .setName(List.of(new HumanName()
                        .setText(user.getName())
                        .setFamily(user.getSurname())
                        .setUse(HumanName.NameUse.OFFICIAL)
                        .setGiven(List.of(new StringType(user.getName() + " " + user.getSurname())))));
        practitioner
                .setTelecom(List.of(new ContactPoint()
                        .setSystem(ContactPoint.ContactPointSystem.EMAIL)
                        .setUse(ContactPoint.ContactPointUse.WORK)
                        .setValue(user.getEmail()),
                        new ContactPoint()
                        .setSystem(ContactPoint.ContactPointSystem.PHONE)
                                .setUse(ContactPoint.ContactPointUse.WORK)
                                .setValue(user.getPhoneNumber())));
        practitioner.setIdentifier(List.of(new Identifier()
                .setUse(Identifier.IdentifierUse.SECONDARY)
                .setValue(user.getId())));
        return practitioner;
    }

    public static User fromUserRepresentation(UserRepresentation userRepresentation){
        User user = new User();
        user.setId(userRepresentation.getId());
        user.setName(userRepresentation.getFirstName());
        user.setSurname(userRepresentation.getLastName());
        user.setPhoneNumber(userRepresentation.getAttributes().get("phoneNumber").get(0));
        user.setEmail(userRepresentation.getEmail());
        return user;
    }

    public static User fromPractitioner(Practitioner practitioner){
        User user = new User();
        user.setId(practitioner.getIdentifier().get(0).getValue());
        user.setName(practitioner.getName().get(0).getText());
        user.setSurname(practitioner.getName().get(0).getFamily());
        user.setEmail(practitioner.getTelecom().get(0).getValue());
        user.setPhoneNumber(practitioner.getTelecom().get(1).getValue());
        return user;
    }

}
