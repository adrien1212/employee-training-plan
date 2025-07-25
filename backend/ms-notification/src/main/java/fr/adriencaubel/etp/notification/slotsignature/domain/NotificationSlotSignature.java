package fr.adriencaubel.etp.notification.slotsignature.domain;


import fr.adriencaubel.etp.notification.parameters.domain.Notification;
import fr.adriencaubel.etp.notification.parameters.domain.NotificationStatus;
import fr.adriencaubel.etp.notification.slotsignature.listener.NotificationSlotSignatureRequestModel;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class NotificationSlotSignature extends Notification {
    private Long slotSignatureId;

    public static NotificationSlotSignature create(NotificationSlotSignatureRequestModel payload) {
        NotificationSlotSignature notification = new NotificationSlotSignature();
        notification.setNotificationType(payload.getNotificationType());
        notification.setSlotSignatureId(payload.getSlotSignatureId());
        notification.setCreatedAt(LocalDateTime.now());
        notification.setNotificationStatus(NotificationStatus.PENDING);
        return notification;
    }
}
