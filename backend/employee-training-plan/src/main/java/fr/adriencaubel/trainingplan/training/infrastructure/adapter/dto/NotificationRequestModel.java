package fr.adriencaubel.trainingplan.training.infrastructure.adapter.dto;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class NotificationRequestModel<T extends NotificationPayload> {
    @NonNull
    private NotificationType notificationType;

    /**
     * When the job was actually enqueued for execution (after scheduler picks it up).
     */
    private LocalDateTime scheduledAt;

    @NonNull
    private T payload;

    public NotificationRequestModel(@NonNull NotificationType notificationType, LocalDateTime scheduledAt, @NonNull T payload) {
        this.notificationType = notificationType;
        this.scheduledAt = scheduledAt;
        this.payload = payload;
    }
}