package org.fhir.auth.irccs.entity;


import java.util.HashMap;
import java.util.List;

import org.hl7.fhir.r5.model.ContactPoint;
import org.hl7.fhir.r5.model.HumanName;
import org.hl7.fhir.r5.model.Identifier;
import org.hl7.fhir.r5.model.Practitioner;
import org.hl7.fhir.r5.model.StringType;
import org.keycloak.representations.idm.UserRepresentation;


public class User {
    private String id;
    private String name;
    private String surname;
    private String email;
    private String password;
    private Boolean enabled;
    private String phoneNumber;
    private List<String> organizationRequest;

    public static UserRepresentation toUserRepresentation(User user){
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setUsername(user.getEmail());
        userRepresentation.setEmail(user.getEmail());
        userRepresentation.setEmailVerified(true);
        userRepresentation.setEnabled(user.getEnabled());
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
        practitioner.setActive(user.getEnabled());
        return practitioner;
    }

    public static User fromUserRepresentation(UserRepresentation userRepresentation){
        User user = new User();
        user.setId(userRepresentation.getId());
        user.setName(userRepresentation.getFirstName());
        user.setSurname(userRepresentation.getLastName());
        user.setPhoneNumber(userRepresentation.getAttributes().get("phoneNumber").get(0));
        user.setOrganizationRequest(userRepresentation.getAttributes().get("organizationRequest"));
        user.setEmail(userRepresentation.getEmail());
        user.setEnabled(userRepresentation.isEnabled());
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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public List<String> getOrganizationRequest() {
        return organizationRequest;
    }

    public void setOrganizationRequest(List<String> organizationRequest) {
        this.organizationRequest = organizationRequest;
    }
}
