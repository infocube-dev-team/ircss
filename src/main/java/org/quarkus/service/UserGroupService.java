/*
package org.quarkus.service;

import jakarta.inject.Inject;
import org.quarkus.controller.UserController;
import org.quarkus.controller.UserGroupController;
import org.quarkus.entity.User;
import org.quarkus.entity.UserGroup;
import org.quarkus.entity.UserGroupCommand;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class UserGroupService implements UserGroupController {

    public static List<UserGroup> userGroups = new ArrayList<>();

    @Inject
    UserService userService;

    public List<UserGroup> getAllUserGroups() {
        return userGroups;
    }

    public UserGroup getUserGroupById(Long id) {
        return userGroups.stream().filter(group -> group.getId().equals(id)).findFirst().orElse(null);
    }

    public void createUserGroup(UserGroupCommand command) {
        List<User> users = command.getUserIds().stream().map(userService::getUserById).collect(Collectors.toList());
        UserGroup userGroup = new UserGroup(command.getName(), users);
        users.forEach(user -> {
            List<UserGroup> userGroupList = user.getUserGroups();
            userGroupList.add(userGroup);
            user.setUserGroups(userGroupList);
        });
        userGroups.add(userGroup);
    }

    public void updateUserGroup(Long id, String name) {
        UserGroup findGroup = getUserGroupById(id);
        int index = userGroups.indexOf(findGroup);
        userGroups.set(index, new UserGroup(findGroup.getId(), name));
    }

    public void deleteUserGroup(Long id) {
        userGroups.removeIf(group -> group.getId().equals(id));
    }

    public void addUserToGroup(Long id, Long userId) {
        UserGroup findGroup = getUserGroupById(id);
        User findUser = userService.getUserById(userId);
        int index = userGroups.indexOf(findGroup);
            List<UserGroup> userGroupList = findUser.getUserGroups();
            userGroupList.add(findGroup);
            List<User> users = findGroup.getUsers();
            users.add(findUser);
        userGroups.set(index, findGroup);
    }

    public void removeUserFromGroup(Long id, Long userId) {
        UserGroup findGroup = getUserGroupById(id);
        User findUser = userService.getUserById(userId);
        int index = userGroups.indexOf(findGroup);
        List<UserGroup> userGroupList = findUser.getUserGroups();
        userGroupList.remove(findGroup);
        List<User> users = findGroup.getUsers();
        users.remove(findUser);
        userGroups.set(index, findGroup);
    }

}
*/
