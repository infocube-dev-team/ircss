package org.fhir.auth.irccs.entity;


import lombok.Getter;
import lombok.Setter;
import org.hl7.fhir.r5.model.*;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Getter @Setter
public class Group {
    private String id;
    private String name;
    private List<String> members;
    private List<String> organizations;

}
