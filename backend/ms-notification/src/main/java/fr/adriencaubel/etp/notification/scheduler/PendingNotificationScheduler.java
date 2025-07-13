package fr.adriencaubel.etp.notification.scheduler;


import fr.adriencaubel.etp.notification.config.feign.CoreAppFeign;
import fr.adriencaubel.etp.notification.config.feign.dto.SessionEnrollmentFeignResponse;
import fr.adriencaubel.etp.notification.infrastructure.adapter.RabbitMqEmailPublisher;
import fr.adriencaubel.etp.notification.parameters.domain.NotificationStatus;
import fr.adriencaubel.etp.notification.parameters.domain.NotificationType;
import fr.adriencaubel.etp.notification.parameters.domain.email.EmailMessage;
import fr.adriencaubel.etp.notification.sessionenrollment.domain.NotificationSessionEnrollment;
import fr.adriencaubel.etp.notification.sessionenrollment.repository.NotificationSessionEnrollmentRepository;
import fr.adriencaubel.etp.notification.sessionenrollment.service.NotificationSessionEnrollmentService;
import lombok.RequiredArgsConstructor;
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

    private final CoreAppFeign sessionEnrollmentFeign;

    private final RabbitMqEmailPublisher rabbitMqEmailPublisher;

    private final NotificationSessionEnrollmentService notificationService;
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

            SessionEnrollmentFeignResponse response =
                    sessionEnrollmentFeign.getSessionEnrollment(notificationSessionEnrollment.getSessionEnrollmentId()).getBody();

            EmailMessage emailMessage = EmailMessage.builder().to(response.getEmployee().getEmail()).subject("a redfinir mais surement subscribe pour le moment").build();

            notificationSessionEnrollment.markSend();

            rabbitMqEmailPublisher.publish(emailMessage);

            notificationSessionEnrollmentRepository.save(notificationSessionEnrollment);
        }
    }

    private boolean isSessionEnrollmentUnsubscribed(NotificationSessionEnrollment sessionEnrollment) {
        List<NotificationSessionEnrollment> sessionEnrollments = sessionEnrollmentRepository.findByNotificationTypeAndSessionEnrollmentId(NotificationType.UNSUBSCRIBE_TO_SESSION, sessionEnrollment.getSessionEnrollmentId());
        return sessionEnrollments.size() > 0;
    }
}
