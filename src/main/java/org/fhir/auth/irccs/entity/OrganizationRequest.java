package org.fhir.auth.irccs.entity;

public class OrganizationRequest {
    String label;
    String value;

    public OrganizationRequest(String name, String keycloakId) {
        this.label = name;
        this.value = keycloakId;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
