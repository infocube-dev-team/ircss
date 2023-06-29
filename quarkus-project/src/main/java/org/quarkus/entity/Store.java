package org.quarkus.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Store {


    @Id
    @GeneratedValue
    private Long id;

    @Column(length = 40, unique = true)
    private String code;

    @Column(length = 40, unique = true)
    private String description;
}
