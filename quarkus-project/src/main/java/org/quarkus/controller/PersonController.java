package org.quarkus.controller;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.quarkus.dto.PersonDto;
import org.quarkus.entity.Person;

import java.util.List;

@Path("/person")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface PersonController {

    @GET
    @Path("/findAll")
    List<Person> findAll();

    @POST
    Response createPerson(Person dto);

    @PUT
    @Path("/{id}")
    Response updatePerson(@PathParam("id") Long id, Person dto);

    @DELETE
    @Path("/{id}")
    Response deletePerson(@PathParam("id") Long id);
}
