package org.fhir.auth.irccs.entity;

public class OfficeType {
    public String groupId;
    public boolean frontOffice;
    public boolean backOffice;

    public OfficeType() {
    }

    public OfficeType(String groupId, boolean frontOffice, boolean backOffice) {
        this.groupId = groupId;
        this.frontOffice = frontOffice;
        this.backOffice = backOffice;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public boolean isFrontOffice() {
        return frontOffice;
    }

    public void setFrontOffice(boolean frontOffice) {
        this.frontOffice = frontOffice;
    }

    public boolean isBackOffice() {
        return backOffice;
    }

    public void setBackOffice(boolean backOffice) {
        this.backOffice = backOffice;
    }
}
