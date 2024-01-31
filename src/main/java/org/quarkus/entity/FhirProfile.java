package org.quarkus.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FhirProfile {
    private static final AtomicInteger counter = new AtomicInteger(0);
    private Long id;
    private List<ResourceType> resourceTypes;

    public FhirProfile(List<ResourceType> resourceTypes) {
        this.resourceTypes = resourceTypes;
        this.id = (long) counter.getAndIncrement();
    }
}
