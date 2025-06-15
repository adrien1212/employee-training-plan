package fr.adriencaubel.trainingplan.training.domain.event;

import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import lombok.Getter;

@Getter
public class EmployeeSubscribedEvent {
    private final SessionEnrollment sessionEnrollment;

    public EmployeeSubscribedEvent(SessionEnrollment sessionEnrollment) {
        this.sessionEnrollment = sessionEnrollment;
    }
}