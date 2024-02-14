package org.fhir.auth.entity;


import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter @Setter
public class PermissionWrapper {
    private String groupName;
    private List<Permission> permissions;
}
