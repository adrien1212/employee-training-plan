package fr.adriencaubel.etp.notification.parameters.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@MappedSuperclass
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Enumerated(EnumType.STRING)
    protected NotificationType notificationType;

    /**
     * When the notification is persisted
     */
    protected LocalDateTime createdAt = LocalDateTime.now();


    @Enumerated(EnumType.STRING)
    protected NotificationStatus notificationStatus;

    /**
     * Timestamp of actual send or exec.
     */
    protected LocalDateTime sendAt;

    /**
     * If cancelled, reason code/message (INACTIVE_USER, ERROR, etc).
     */
    @Column(columnDefinition = "TEXT")
    protected String cancelledReason;

    public void markSend() {
        this.sendAt = LocalDateTime.now();
        this.notificationStatus = NotificationStatus.SENT;
    }

    public void markFailed(String reason) {
        this.notificationStatus = NotificationStatus.FAILED;
        this.cancelledReason = reason;
    }
}
