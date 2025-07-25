package fr.adriencaubel.etp.notification.feedback.listener;

import fr.adriencaubel.etp.notification.parameters.domain.NotificationType;
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
}