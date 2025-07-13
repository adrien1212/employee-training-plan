package fr.adriencaubel.etp.notification.sessionenrollment.listener;

import fr.adriencaubel.etp.notification.parameters.domain.NotificationType;
import jakarta.annotation.Nonnull;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Payload for following usecase :
 * - subscription
 * - unsubsription
 * - relance
 */
@Getter
@Setter
public class NotificationSessionEnrollmentRequestModel {

    @NonNull
    private NotificationType notificationType;

    /**
     * 	When the job was actually enqueued for execution (after scheduler picks it up).
     */
    private LocalDateTime scheduledAt;

    @Nonnull
    public Long sessionEnrollmentId;
}
