package fr.adriencaubel.trainingplan.training.infrastructure.adapter.dto;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@RequiredArgsConstructor
public class NotificationSlotSignatureRequestModel implements Serializable {
    @NonNull
    private NotificationType notificationType;

    @NonNull
    private Long slotSignatureId;
}
