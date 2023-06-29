package org.quarkus.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@RegisterForReflection
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonDto {

    private String name;
    private String surname;
    private String fiscalCode;
    private String email;
    private String cellularNumber;
    private Character sexCode;
}
