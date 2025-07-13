package fr.adriencaubel.trainingplan.training.infrastructure.adapter.dto;

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
