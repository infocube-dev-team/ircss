package org.fhir.auth.irccs.RollbackSystem;

import java.util.ArrayList;
import java.util.List;

public class RollbackManager {
    private final List<Command> commands = new ArrayList<>();

    public void addCommand(Command command) {
        commands.add(command);
    }

    public void executeCommands() throws Exception {
        int lastSuccessfulCommandIndex = -1;
        try {
            for (int i =  0; i < commands.size(); i++) {
                commands.get(i).execute();
                lastSuccessfulCommandIndex = i;
            }
        } catch (Exception e) {
            rollbackCommands(lastSuccessfulCommandIndex);
            throw e; // Propagate the original exception
        }
    }

    private void rollbackCommands(int lastSuccessfulCommandIndex) {
        for (int i = lastSuccessfulCommandIndex; i >=  0; i--) {
            try {
                commands.get(i).rollback();
            } catch (Exception rollbackException) {
                System.err.println("Rollback failed for command at index " + i + ": " + rollbackException.getMessage());
            }
        }
    }
}
