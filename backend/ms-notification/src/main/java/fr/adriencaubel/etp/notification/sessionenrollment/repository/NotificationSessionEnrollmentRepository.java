package fr.adriencaubel.etp.notification.sessionenrollment.repository;

import fr.adriencaubel.etp.notification.parameters.domain.NotificationStatus;
import fr.adriencaubel.etp.notification.parameters.domain.NotificationType;
import fr.adriencaubel.etp.notification.sessionenrollment.domain.NotificationSessionEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationSessionEnrollmentRepository extends JpaRepository<NotificationSessionEnrollment, Long> {
    List<NotificationSessionEnrollment> findByNotificationStatusAndScheduledAtBetween(NotificationStatus notificationStatus, LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<NotificationSessionEnrollment> findByNotificationTypeAndSessionEnrollmentId(NotificationType notificationSessionEnrollmentType, Long sessionEnrollmentId);
}
