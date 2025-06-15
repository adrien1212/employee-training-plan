package fr.adriencaubel.notification.listener.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrainerNotificationPayload implements NotificationPayload {
    private Long trainerId;
    private Long sessionId;
}
