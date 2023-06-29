package org.quarkus.dto.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.quarkus.dto.StoreDto;
import org.quarkus.entity.Store;

import java.util.List;

@Mapper(
        componentModel = "jakarta",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface StoreDtoMapper {


    StoreDto toDto(Store entity);

    List<StoreDto> toDto(List<Store> entity);

    Store toEntity(StoreDto dto);

    List<Store> toEntity(List<StoreDto> dto);
}
