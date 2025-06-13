package fr.adriencaubel.notification.domain;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;

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
     * When the notification should be executed.
     */
    private LocalDateTime dueDate;

    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * 	When the job was actually enqueued for execution (after scheduler picks it up).
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
    private String cancelledReason;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private String payload;
}
