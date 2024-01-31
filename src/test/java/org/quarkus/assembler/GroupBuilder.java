package org.quarkus.assembler;

import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;

public class GroupBuilder {
    private String name;
    private List<Integer> userIds;
    private Integer id;

    public GroupBuilder(String name, List<Integer> userIds) {
        this.name = name;
        this.userIds = userIds;
    }

    public GroupBuilder withId(Integer id) {
        this.id = id;
        return this;
    }

    public JsonObject build() {
        JsonObject user = new JsonObject();
        if (id != null) {
            user.put("id", id);
        }
        user.put("name", name);
        user.put("userIds", userIds);
        return user;
    }
}
