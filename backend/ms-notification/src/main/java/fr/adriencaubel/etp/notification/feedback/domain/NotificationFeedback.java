package fr.adriencaubel.etp.notification.feedback.domain;

import fr.adriencaubel.etp.notification.feedback.listener.NotificationFeedbackRequestModel;
import fr.adriencaubel.etp.notification.parameters.domain.Notification;
import fr.adriencaubel.etp.notification.parameters.domain.NotificationStatus;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class NotificationFeedback extends Notification {
    private Long feedbackId;

    public static NotificationFeedback create(NotificationFeedbackRequestModel notificationFeedbackRequestModel) {
        NotificationFeedback feedback = new NotificationFeedback();
        feedback.setNotificationType(notificationFeedbackRequestModel.getNotificationType());
        feedback.setFeedbackId(notificationFeedbackRequestModel.getFeedbackId());
        feedback.setCreatedAt(LocalDateTime.now());
        feedback.setNotificationStatus(NotificationStatus.PENDING);
        return feedback;
    }
}
