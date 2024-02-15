package org.fhir.auth.irccs.entity;


import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter @Setter
public class User {
    private String name;
    private String surname;
    private String email;
    private String password;
    private String phoneNumber;
    private List<String> organizationRequest;
}
