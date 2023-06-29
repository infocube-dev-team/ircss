package org.quarkus.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import org.quarkus.controller.StoreController;
import org.quarkus.dto.mapper.StoreDtoMapper;
import org.quarkus.entity.Store;
import org.quarkus.repository.StoreRepository;


import java.util.List;

@ApplicationScoped
public class StoreService implements StoreController {

    @Inject
    StoreRepository storeRepository;

    @Inject
    StoreDtoMapper storeDtoMapper;

    @Override
    public List<Store> getAll() {
        return storeRepository.listAll();
    }

    @Override
    @Transactional
    public Response create(Store store) {
        storeRepository.persist(store);
        return Response.ok().build();
    }

    @Override
    @Transactional
    public Response update(Store store, Long id) {
        Store s = storeRepository.findById(id);
        s.setCode(store.getCode());
        s.setDescription(store.getDescription());
        storeRepository.persist(s);
        return Response.ok().build();
    }

    @Override
    public Response delete(Long id) {
        storeRepository.deleteById(id);
        return Response.ok().build();
    }
}
