package org.fhir.auth.irccs.service;

import jakarta.enterprise.context.RequestScoped;
import org.hl7.fhir.r5.model.Group;
import org.quarkus.irccs.client.controllers.GenericController;

@RequestScoped
public class GroupFhirController extends GenericController<Group> {

}
