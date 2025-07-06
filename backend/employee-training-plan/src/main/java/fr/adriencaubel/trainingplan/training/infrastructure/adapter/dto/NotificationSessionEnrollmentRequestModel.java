package fr.adriencaubel.trainingplan.training.infrastructure.adapter.dto;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class NotificationSessionEnrollmentRequestModel {
    @NonNull
    private NotificationType notificationType;

    /**
     * When the job was actually enqueued for execution (after scheduler picks it up).
     */
    private LocalDateTime scheduledAt;

    @NonNull
    private Long sessionEnrollmentId;

    public NotificationSessionEnrollmentRequestModel(@NonNull NotificationType notificationType, LocalDateTime scheduledAt, @NonNull Long sessionEnrollmentId) {
        this.notificationType = notificationType;
        this.scheduledAt = scheduledAt;
        this.sessionEnrollmentId = sessionEnrollmentId;
    }
}