package fr.adriencaubel.etp.notification.listener.requestmodel;

import fr.adriencaubel.etp.notification.parameters.domain.NotificationType;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class NotificationSlotSignatureRequestModel {
    @NonNull
    private NotificationType notificationType;

    @NonNull
    private Long slotSignatureId;
}
