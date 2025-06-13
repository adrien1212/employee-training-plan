package fr.adriencaubel.trainingplan.training.domain.event;

import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import lombok.Getter;

import java.util.List;

@Getter
public class SessionCompletedEvent {
    private final Session session;
    private final List<SessionEnrollment> sessionEnrollments;

    public SessionCompletedEvent(Session Session, List<SessionEnrollment> sessionEnrollments) {
        this.session = Session;
        this.sessionEnrollments = sessionEnrollments;
    }
}
