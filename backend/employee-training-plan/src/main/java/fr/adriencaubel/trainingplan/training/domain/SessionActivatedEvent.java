package fr.adriencaubel.trainingplan.training.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SessionActivatedEvent {
    private Long sessionId;

    public SessionActivatedEvent(Long sessionId) {
        this.sessionId = sessionId;
    }
}
