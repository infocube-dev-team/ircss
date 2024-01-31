/*
package org.quarkus.service;

import jakarta.inject.Inject;
import org.quarkus.controller.UserController;
import org.quarkus.controller.UserGroupFhirProfileController;
import org.quarkus.entity.*;
import org.quarkus.enums.Policy;

import java.util.*;
import java.util.stream.Collectors;

public class UserGroupFhirProfileService implements UserGroupFhirProfileController {
    public static List<UserGroup> userGroups = new ArrayList<>();

    @Inject
    UserGroupService userGroupService;
    @Inject
    FhirProfileService fhirProfileService;
    @Inject
    UserService userService;

    public void associateFhirProfileWithUserGroup(Long id, Long profileId) {
        UserGroup userGroup = userGroupService.getUserGroupById(id);
        userGroup.setFhirProfile(fhirProfileService.getFhirProfileById(profileId));
    }

    public void dissociateFhirProfileFromUserGroup(Long id, Long profileId) {
        UserGroup userGroup = userGroupService.getUserGroupById(id);
        userGroup.setFhirProfile(null);
    }

    public FhirProfile getComputedFhirProfileForUser(Long userId) {
        return intersectFhirProfiles(userService.getUserById(userId).getUserGroups().stream().map(UserGroup::getFhirProfile).collect(Collectors.toList()));
    }

    private FhirProfile intersectFhirProfiles(List<FhirProfile> fhirProfiles) {
        if (fhirProfiles.isEmpty()) {
            return null;
        }
        List<Method> methodList = new ArrayList<>();
        ResourceType generatedResourceType = new ResourceType();

        List<ResourceType> resourceTypes = fhirProfiles.stream().map(FhirProfile::getResourceTypes).toList().stream()
                .collect(ArrayList::new, List::addAll, List::addAll);

        List<Method> methods = resourceTypes.stream().map(ResourceType::getMethods).toList().stream()
                .collect(ArrayList::new, List::addAll, List::addAll);

        System.out.println(methodList);
                for (Method method : methods) {
                    String methodName = method.getMethod();
                    List<String> methodNameList = methodList.stream().map(Method::getMethod).toList();
                    if (methodNameList.contains(methodName)) {
                        Method existingMethod = methodList.stream().filter(method1 -> method1.getMethod().equals(methodName)).toList().get(0);
                        if (existingMethod.getPolicy().equals(Policy.ENABLED) && method.getPolicy().equals(Policy.DISABLED)) {
                            methodList.add(method);
                            methodList.remove(existingMethod);
                        }
                    } else {
                        methodList.add(method);
                    }
            }

        System.out.println(methodList);
        generatedResourceType.setResourceType("Generated Profile");
        generatedResourceType.setMethods(methodList);
        FhirProfile generatedFhirProfile = new FhirProfile();
        generatedFhirProfile.setResourceTypes(List.of(generatedResourceType));

        return generatedFhirProfile;
    }
}*/
