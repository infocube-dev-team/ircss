package org.quarkus.controller;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.quarkus.dto.StoreDto;
import org.quarkus.entity.Store;

import java.util.List;

@Path("/store")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface StoreController {

    @GET
    List<Store> getAll();

    @POST
    Response create(Store store);

    @PUT
    @Path("/{id}")
    Response update(Store store, @PathParam("id") Long id);


    @DELETE
    @Path("/{id}")
    Response delete(@PathParam("id") Long id);
}
