package fr.adriencaubel.trainingplan.training.infrastructure.adapter.dto;

import jakarta.annotation.Nonnull;
import lombok.Getter;
import lombok.Setter;

/**
 * Payload for following usecase :
 * - subscription
 * - unsubsription
 * - relance
 */
@Getter
@Setter
public class SubscriptionNotificationPayload implements NotificationPayload {
    @Nonnull
    public Long sessionEnrollmentId;

    public SubscriptionNotificationPayload(@Nonnull Long sessionEnrollmentId) {
        this.sessionEnrollmentId = sessionEnrollmentId;
    }
}
