package fr.adriencaubel.etp.notification.listener.requestmodel;

import fr.adriencaubel.etp.notification.domain.sessionenrollment.NotificationSessionEnrollmentType;
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
    private NotificationSessionEnrollmentType notificationType;

    /**
     * 	When the job was actually enqueued for execution (after scheduler picks it up).
     */
    private LocalDateTime scheduledAt;

    @Nonnull
    public Long sessionEnrollmentId;
}
