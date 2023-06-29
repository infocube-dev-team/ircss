package org.quarkus.dto.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.quarkus.dto.PersonDto;
import org.quarkus.entity.Person;

import java.util.List;

@Mapper(
        componentModel = "jakarta",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PersonDtoMapper {

    PersonDto toDto(Person entity);

    List<PersonDto> toDto(List<Person> entity);

    Person toEntity(PersonDto dto);

    List<Person> toEntity(List<PersonDto> dto);
}
