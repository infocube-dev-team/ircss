package org.quarkus.assembler;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.quarkus.entity.FhirProfile;
import org.quarkus.entity.ResourceType;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileBuilder {
    private List<ResourceType> resourceTypes;
    private Integer id;

    public ProfileBuilder(List<ResourceType> resourceTypes) {
        this.resourceTypes = resourceTypes;
    }

    public ProfileBuilder(FhirProfile fhirProfile) {
        this.resourceTypes = fhirProfile.getResourceTypes();
    }

    public ProfileBuilder withId(Integer id) {
        this.id = id;
        return this;
    }

    public FhirProfile buildProfile() {
        return new FhirProfile(resourceTypes);
    }
    public JsonObject build() {
        JsonObject profile = new JsonObject();
        if (id != null) {
            profile.put("id", id);
        }
        profile.put("resourceTypes", resourceTypes);
        return profile;
    }

    public JsonArray buildResourceTypes() {
        return build().getJsonArray("resourceTypes");
    }
}
