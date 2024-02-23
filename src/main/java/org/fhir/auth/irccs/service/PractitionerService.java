package org.fhir.auth.irccs.service;


import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.fhir.auth.irccs.entity.User;
import org.hl7.fhir.instance.model.api.IIdType;
import org.hl7.fhir.r5.model.*;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.quarkus.irccs.client.restclient.FhirClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@ApplicationScoped
public class PractitionerService {
    private final static Logger LOG = LoggerFactory.getLogger(PractitionerService.class);
    @Inject
    Keycloak keycloak;
    @Inject
    FhirClient<Practitioner> practitionerController;

    @Inject
    UserService userService;

    @ConfigProperty(name = "quarkus.keycloak.admin-client.realm")
    String realm;

    private RealmResource getRealm(){return keycloak.realm(realm);}

    public Response getAllPractitioners(UriInfo searchParameters) {
        String queryParams = practitionerController.convertToQueryString(searchParameters.getQueryParameters());
        return Response.ok().status(Response.Status.CREATED.getStatusCode(),
                practitionerController.encodeResourceToString(practitionerController.readAll(queryParams))).build();
    }

    public Response getPractitioner(String id) {
        return Response.ok().status(Response.Status.CREATED.getStatusCode(),
                practitionerController.encodeResourceToString(practitionerController
                        .read(new IdType(practitionerController.getResourceType().getSimpleName(), id)))
                ).build();
    }


    public Response createPractitioner(Practitioner pr) {
        return Response.status(Response.Status.METHOD_NOT_ALLOWED).build();
    }

    public Response updatePractitioner(Practitioner practitioner) {
        User user = User.fromPractitioner(practitioner);
        User userBeforeRollback =  User.fromUserRepresentation(getRealm().users().get(user.getId()).toRepresentation());
        try {
            getRealm().users().get(user.getId()).update(User.toUserRepresentation(user));
        } catch (Exception e){
            LOG.error("Couldn't update user {} ", practitioner.getIdentifier().get(0).getValue(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), e.getMessage()).build();
        }

        try {
            practitionerController.update(practitioner);
        } catch (Exception e){
            getRealm().users().get(user.getId()).update(User.toUserRepresentation(userBeforeRollback));
            LOG.error("Couldn't update fhir practitioner {} ", practitioner.getIdentifier().get(0).getValue(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), e.getMessage()).build();
        }

        return Response.ok().status(Response.Status.CREATED).build();
    }

    public Response deletePractitioner(UriInfo searchParameters) {
        return Response.status(Response.Status.METHOD_NOT_ALLOWED).build();
    }

}

