package org.fhir.auth.irccs.RollbackSystem;

public class Command {
    private final Runnable executeAction;
    private final Runnable rollbackAction;

    public Command(Runnable executeAction, Runnable rollbackAction) {
        this.executeAction = executeAction;
        this.rollbackAction = rollbackAction;
    }

    public void execute() {
        executeAction.run();
    }

    public void rollback() {
        rollbackAction.run();
    }
}