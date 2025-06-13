package fr.adriencaubel.trainingplan.training.domain.event;

import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class SessionStatusChanged {
    private final Session session;
    private final SessionStatus newStatus;
    private final LocalDateTime changedAt;

    public SessionStatusChanged(Session session, SessionStatus newStatus) {
        this.session = session;
        this.newStatus = newStatus;
        this.changedAt = LocalDateTime.now();
    }
}
