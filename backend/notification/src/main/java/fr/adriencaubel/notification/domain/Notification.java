package fr.adriencaubel.notification.domain;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.adriencaubel.notification.listener.dto.NotificationPayload;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@Entity
@Table
public class Notification {
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

    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, String> payload;

    public static Notification create(NotificationType notificationType, LocalDateTime scheduledAt, NotificationPayload payload) {
        Notification notification = new Notification();
        notification.setNotificationType(notificationType);
        notification.setScheduledAt(scheduledAt);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> map = objectMapper.convertValue(
                payload,
                new TypeReference<Map<String, String>>() {}
        );

        notification.setPayload(map);
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
