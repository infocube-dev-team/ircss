package org.quarkus.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.quarkus.enums.Policy;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Method {
    private String method;
    private Policy policy;

    public Method(String method, String policy) {
        this.method = method;
        setPolicy(policy);
    }

    public void setPolicy(String policy) {
        this.policy = Policy.fromString(policy);
    }
    public void setPolicy(Policy policy) {
        this.policy = policy;
    }
}
