package fr.adriencaubel.etp.notification.sessionenrollment.domain;

import fr.adriencaubel.etp.notification.parameters.domain.Notification;
import fr.adriencaubel.etp.notification.parameters.domain.NotificationStatus;
import fr.adriencaubel.etp.notification.parameters.domain.NotificationType;
import fr.adriencaubel.etp.notification.sessionenrollment.listener.NotificationSessionEnrollmentRequestModel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class NotificationSessionEnrollment extends Notification {
    /**
     * When the notification should be executed.
     */
    private LocalDateTime scheduledAt;

    private Long sessionEnrollmentId;

    public static NotificationSessionEnrollment create(NotificationType notificationType, LocalDateTime scheduledAt, NotificationSessionEnrollmentRequestModel payload) {
        NotificationSessionEnrollment notification = new NotificationSessionEnrollment();
        notification.setNotificationType(notificationType);
        notification.setScheduledAt(scheduledAt);
        notification.setSessionEnrollmentId(payload.getSessionEnrollmentId());
        notification.setCreatedAt(LocalDateTime.now());
        notification.setNotificationStatus(NotificationStatus.PENDING);
        return notification;
    }
}
