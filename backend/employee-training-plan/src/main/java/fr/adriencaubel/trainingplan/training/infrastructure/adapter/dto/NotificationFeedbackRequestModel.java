package fr.adriencaubel.trainingplan.training.infrastructure.adapter.dto;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
public class NotificationFeedbackRequestModel {
    @NonNull
    private NotificationType notificationType;

    @NonNull
    private Long feedbackId;

    public NotificationFeedbackRequestModel(@NonNull NotificationType notificationType, @NonNull Long feedbackId) {
        this.notificationType = notificationType;
        this.feedbackId = feedbackId;
    }
}