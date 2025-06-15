package fr.adriencaubel.trainingplan.training.infrastructure.adapter.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrainerNotificationPayload implements NotificationPayload {
    private Long trainerId;
    private Long sessionId;

    public TrainerNotificationPayload(Long trainerId, Long sessionId) {
        this.trainerId = trainerId;
        this.sessionId = sessionId;
    }
}
