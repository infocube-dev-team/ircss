package org.fhir.auth.service;

import jakarta.enterprise.context.RequestScoped;
import org.hl7.fhir.r5.model.Group;
import org.hl7.fhir.r5.model.Practitioner;
import org.quarkus.irccs.client.controllers.GenericController;

@RequestScoped
public class GroupController extends GenericController<Group> {

}
