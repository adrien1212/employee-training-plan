package fr.adriencaubel.etp.notification.slotsignature.domain;


import fr.adriencaubel.etp.notification.listener.requestmodel.NotificationSlotSignatureRequestModel;
import fr.adriencaubel.etp.notification.parameters.domain.NotificationStatus;
import fr.adriencaubel.etp.notification.parameters.domain.NotificationType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table
public class NotificationSlotSignature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    /**
     * When the notification is persisted
     */
    private LocalDateTime createdAt = LocalDateTime.now();


    @Enumerated(EnumType.STRING)
    private NotificationStatus notificationStatus;

    /**
     * Timestamp of actual send or exec.
     */
    private LocalDateTime sendAt;

    /**
     * If cancelled, reason code/message (INACTIVE_USER, ERROR, etc).
     */
    @Column(columnDefinition = "TEXT")
    private String cancelledReason;

    private Long slotSignatureId;

    public static NotificationSlotSignature create(NotificationSlotSignatureRequestModel payload) {
        NotificationSlotSignature notification = new NotificationSlotSignature();
        notification.setNotificationType(payload.getNotificationType());
        notification.setSlotSignatureId(payload.getSlotSignatureId());
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
