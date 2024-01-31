package org.quarkus.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResourceType {
    private String resourceType;
    private List<Method> methods = new ArrayList<>();
}
