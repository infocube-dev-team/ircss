package org.quarkus.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.quarkus.entity.Store;


@ApplicationScoped
public class StoreRepository implements PanacheRepository<Store> {
}
