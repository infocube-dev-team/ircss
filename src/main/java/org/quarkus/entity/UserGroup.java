/*
package org.quarkus.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserGroup {
    private static final AtomicInteger counter = new AtomicInteger(0);
    private Long id;
    private String name;
    private List<User> users;

    private FhirProfile fhirProfile;

    public UserGroup(String name, List<User> users) {
        this.users = users;
        this.name = name;
        this.id = (long) counter.getAndIncrement();
    }

    public UserGroup(Long id,String name) {
        this.name = name;
        this.id = id;
    }

    public UserGroup(Long id, String name, List<User> users) {
        this.users = users;
        this.name = name;
        this.id = id;
    }
}
*/
