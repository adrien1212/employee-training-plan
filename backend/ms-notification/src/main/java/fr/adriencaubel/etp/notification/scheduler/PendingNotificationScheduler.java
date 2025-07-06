package fr.adriencaubel.etp.notification.scheduler;

import fr.adriencaubel.etp.notification.domain.NotificationStatus;
import fr.adriencaubel.etp.notification.domain.email.EmailMessage;
import fr.adriencaubel.etp.notification.domain.sessionenrollment.NotificationSessionEnrollment;
import fr.adriencaubel.etp.notification.domain.sessionenrollment.NotificationSessionEnrollmentRepository;
import fr.adriencaubel.etp.notification.domain.sessionenrollment.NotificationSessionEnrollmentType;
import fr.adriencaubel.etp.notification.infrastructure.adapter.RabbitMqEmailPublisher;
import fr.adriencaubel.etp.notification.infrastructure.adapter.SessionEnrollmentFeign;
import fr.adriencaubel.etp.notification.service.NotificationService;
import fr.adriencaubel.etp.notification.type.SessionEnrollmentRequestModel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PendingNotificationScheduler {
    private final NotificationSessionEnrollmentRepository sessionEnrollmentRepository;

    private final SessionEnrollmentFeign sessionEnrollmentFeign;

    private final RabbitMqEmailPublisher rabbitMqEmailPublisher;

    private final NotificationService notificationService;
    private final NotificationSessionEnrollmentRepository notificationSessionEnrollmentRepository;

    /**
     * Every 10 minutes get pending notification
     */
    @Scheduled(cron = "00 1 * * * *")
    @Transactional
    public void dispatchPending() {
        System.out.println("Scheduling pending notifications");

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();              // 00:00
        LocalDateTime endOfDay   = today.atTime(LocalTime.MAX);       // 23:59:59.999999999

        List<NotificationSessionEnrollment> pendingToday =
                sessionEnrollmentRepository.findByNotificationStatusAndScheduledAtBetween(
                        NotificationStatus.PENDING,
                        startOfDay,
                        endOfDay
                );

        for(NotificationSessionEnrollment notificationSessionEnrollment : pendingToday) {
            // Vérifier que le sessionEnrollment ne soit pas UNSUBSCRIBE
            if(isSessionEnrollmentUnsubscribed(notificationSessionEnrollment)) {
                break;
            }

            ResponseEntity<SessionEnrollmentRequestModel> response =
                    sessionEnrollmentFeign.getSessionEnrollment(notificationSessionEnrollment.getSessionEnrollmentId());

            EmailMessage emailMessage = notificationService.buildEmail(notificationSessionEnrollment, response.getBody());

            notificationSessionEnrollment.markSend();

            rabbitMqEmailPublisher.publish(emailMessage);

            notificationSessionEnrollmentRepository.save(notificationSessionEnrollment);
        }
    }

    private boolean isSessionEnrollmentUnsubscribed(NotificationSessionEnrollment sessionEnrollment) {
        List<NotificationSessionEnrollment> sessionEnrollments = sessionEnrollmentRepository.findByNotificationTypeAndSessionEnrollmentId(NotificationSessionEnrollmentType.UNSUBSCRIBE_TO_SESSION, sessionEnrollment.getSessionEnrollmentId());
        return sessionEnrollments.size() > 0;
    }
}
