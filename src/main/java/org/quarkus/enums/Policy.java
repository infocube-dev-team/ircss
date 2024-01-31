package org.quarkus.enums;

public enum Policy {
    ENABLED("enabled"),
    DISABLED("disabled");

    private String policy;

    Policy(String policy) {
        this.policy = policy;
    }

    public String getPolicy() {
        return policy;
    }

    public static Policy fromString(String policy) {
        for (Policy p : Policy.values()) {
            if (p.getPolicy().equalsIgnoreCase(policy)) {
                return p;
            }
        }
        throw new IllegalArgumentException("Invalid policy: " + policy);
    }
}

