package org.fhir.auth.irccs.exceptions;

import org.hl7.fhir.r5.model.OperationOutcome;
import org.hl7.fhir.r5.utils.client.EFhirClientException;

import java.util.List;

public class OperationException extends EFhirClientException {
    public OperationException(String message) {
        super(message);
    }

    public OperationException(String message, List<OperationOutcome> serverErrors) {
        super(message, serverErrors);
    }

    public OperationException(Exception cause) {
        super(cause);
    }

    public OperationException(String message, Exception cause) {
        super(message, cause);
    }

    public OperationException(String message, OperationOutcome serverError) {
        super(message, serverError);
    }

    public OperationException(String message, OperationOutcome.IssueSeverity issueSeverity) {
        super(message, new OperationOutcome().setIssue(List.of(new OperationOutcome.OperationOutcomeIssueComponent().setSeverity(issueSeverity))));
    }

    public OperationException(OperationOutcome serverError) {
        super(serverError);
    }
}
