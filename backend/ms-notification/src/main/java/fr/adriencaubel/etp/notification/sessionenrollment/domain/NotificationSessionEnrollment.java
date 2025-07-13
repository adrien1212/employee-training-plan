package fr.adriencaubel.etp.notification.sessionenrollment.domain;

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
@Table
public class NotificationSessionEnrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    /**
     * When the notification is persisted
     */
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * When the notification should be executed.
     */
    private LocalDateTime scheduledAt;

    /**
     * Timestamp of actual send or exec.
     */
    private LocalDateTime sendAt;

    @Enumerated(EnumType.STRING)
    private NotificationStatus notificationStatus;

    /**
     * If cancelled, reason code/message (INACTIVE_USER, ERROR, etc).
     */
    @Column(columnDefinition = "TEXT")
    private String cancelledReason;

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

    public void markSend() {
        this.sendAt = LocalDateTime.now();
        this.notificationStatus = NotificationStatus.SENT;
    }

    public void markFailed(String reason) {
        this.notificationStatus = NotificationStatus.FAILED;
        this.cancelledReason = reason;
    }
}
