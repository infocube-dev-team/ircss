package org.fhir.auth.irccs;

import org.hl7.fhir.r5.model.OperationOutcome;
import org.hl7.fhir.r5.utils.client.EFhirClientException;

import java.util.List;

public class AuthException extends EFhirClientException {
    public AuthException(String message) {
        super(message);
    }

    public AuthException(String message, List<OperationOutcome> serverErrors) {
        super(message, serverErrors);
    }

    public AuthException(Exception cause) {
        super(cause);
    }

    public AuthException(String message, Exception cause) {
        super(message, cause);
    }

    public AuthException(String message, OperationOutcome serverError) {
        super(message, serverError);
    }

    public AuthException(OperationOutcome serverError) {
        super(serverError);
    }
}
