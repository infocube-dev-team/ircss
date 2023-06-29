package org.quarkus.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.quarkus.entity.Person;

@ApplicationScoped
public class PersonRepository implements PanacheRepository<Person> {
}
