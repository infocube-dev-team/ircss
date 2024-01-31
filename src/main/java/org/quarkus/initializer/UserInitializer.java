/*
package org.quarkus.initializer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.runtime.Startup;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.quarkus.entity.*;
import org.quarkus.service.FhirProfileService;
import org.quarkus.service.UserGroupService;
import org.quarkus.service.UserService;

import java.util.ArrayList;
import java.util.List;

@Startup
@ApplicationScoped
public class UserInitializer {

    @Inject
    UserService userService;

    @Inject
    UserGroupService userGroupService;

    @Inject
    FhirProfileService fhirProfileService;

    @PostConstruct
    void init() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();

        //Popolamento utenti
        User user0 = objectMapper.readValue("{\"name\": \"Giovanni\", \"surname\": \"De Francesco\" }", User.class);
        User user1 = objectMapper.readValue("{\"name\": \"Mario\", \"surname\": \"Gambella\" }", User.class);
        User user2 = objectMapper.readValue("{\"name\": \"Lucio\", \"surname\": \"Rossi\" }", User.class);

        userService.createUser(user0);
        userService.createUser(user1);
        userService.createUser(user2);

        System.out.println(userService.getAllUsers());


        //Popolamento gruppi

        UserGroupCommand userGroupCommand = objectMapper.readValue("{\"name\": \"Medici\", \"userIds\": [0,1] }", UserGroupCommand.class);
        userGroupService.createUserGroup(userGroupCommand);

        UserGroupCommand userGroupCommand2 = objectMapper.readValue("{\"name\": \"Tirocinanti\", \"userIds\": [1] }", UserGroupCommand.class);
        userGroupService.createUserGroup(userGroupCommand2);
        
        ResourceType resourceTypes = objectMapper.readValue("{\"resourceType\":\"Medico\",\"methods\":[{\"method\":\"create\",\"policy\":\"enabled\"},{\"method\":\"read\",\"policy\":\"enabled\"}]}", ResourceType.class);
        fhirProfileService.createFhirProfile(List.of(resourceTypes));

        ResourceType resourceTypes2 = objectMapper.readValue("{\"resourceType\":\"Tirocinante\",\"methods\":[{\"method\":\"create\",\"policy\":\"disabled\"},{\"method\":\"read\",\"policy\":\"disabled\"}]}", ResourceType.class);
        fhirProfileService.createFhirProfile(List.of(resourceTypes2));

    }
}*/
