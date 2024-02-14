package org.fhir.auth.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import org.hl7.fhir.r5.model.Practitioner;
import org.quarkus.irccs.client.controllers.GenericController;

@RequestScoped
public class PractitionerController extends GenericController<Practitioner> {

}
