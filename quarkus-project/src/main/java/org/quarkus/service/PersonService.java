package org.quarkus.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import org.quarkus.controller.PersonController;
import org.quarkus.dto.PersonDto;
import org.quarkus.dto.mapper.PersonDtoMapper;
import org.quarkus.entity.Person;
import org.quarkus.repository.PersonRepository;

import java.util.List;

@ApplicationScoped
public class PersonService implements PersonController {

    @Inject
    PersonRepository repository;

    @Inject
    PersonDtoMapper mapper;

    @Override
    public List<Person> findAll() {
        return repository.listAll();
    }

    @Override
    @Transactional
    public Response createPerson(Person dto) {
        repository.persist(dto);
        return Response.ok().build();
    }

    @Override
    @Transactional
    public Response updatePerson(Long id, Person dto) {
        Person p = repository.findById(id);
        p.setName(dto.getName());
        p.setEmail(dto.getEmail());
        p.setSurname(dto.getSurname());
        p.setSexCode(dto.getSexCode());
        p.setCellularNumber(dto.getCellularNumber());
        p.setFiscalCode(dto.getFiscalCode());
        repository.persist(p);
        return Response.ok().build();
    }

    @Override
    public Response deletePerson(Long id) {
        repository.deleteById(id);
        return Response.ok().build();
    }
}
