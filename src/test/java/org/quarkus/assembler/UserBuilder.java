package org.quarkus.assembler;

import io.vertx.core.json.JsonObject;

public class UserBuilder {
    private String name;
    private String surname;
    private Integer id;

    public UserBuilder(String name, String surname) {
        this.name = name;
        this.surname = surname;
    }

    public UserBuilder withId(Integer id) {
        this.id = id;
        return this;
    }

    public JsonObject build() {
        JsonObject user = new JsonObject();
        if (id != null) {
            user.put("id", id);
        }
        user.put("name", name);
        user.put("surname", surname);
        return user;
    }
}
