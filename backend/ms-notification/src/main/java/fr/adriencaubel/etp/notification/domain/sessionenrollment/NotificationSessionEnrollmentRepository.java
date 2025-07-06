package fr.adriencaubel.etp.notification.domain.sessionenrollment;

import fr.adriencaubel.etp.notification.domain.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationSessionEnrollmentRepository extends JpaRepository<NotificationSessionEnrollment, Long> {
    List<NotificationSessionEnrollment> findByNotificationStatusAndScheduledAtBetween(NotificationStatus notificationStatus, LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<NotificationSessionEnrollment> findByNotificationTypeAndSessionEnrollmentId(NotificationSessionEnrollmentType notificationSessionEnrollmentType, Long sessionEnrollmentId);
}
