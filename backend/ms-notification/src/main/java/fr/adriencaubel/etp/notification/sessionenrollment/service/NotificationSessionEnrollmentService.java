package fr.adriencaubel.etp.notification.sessionenrollment.service;

import fr.adriencaubel.etp.notification.config.UserService;
import fr.adriencaubel.etp.notification.config.feign.CoreAppFeign;
import fr.adriencaubel.etp.notification.config.feign.dto.SessionEnrollmentFeignResponse;
import fr.adriencaubel.etp.notification.infrastructure.adapter.RabbitMqEmailPublisher;
import fr.adriencaubel.etp.notification.parameters.domain.NotificationParameter;
import fr.adriencaubel.etp.notification.parameters.domain.email.EmailMessage;
import fr.adriencaubel.etp.notification.parameters.repository.NotificationParameterRepository;
import fr.adriencaubel.etp.notification.sessionenrollment.domain.NotificationSessionEnrollment;
import fr.adriencaubel.etp.notification.sessionenrollment.repository.NotificationSessionEnrollmentRepository;
import fr.adriencaubel.etp.notification.sessionenrollment.listener.NotificationSessionEnrollmentRequestModel;
import fr.adriencaubel.etp.notification.slotsignature.repository.NotificationSlotSignatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationSessionEnrollmentService {

    private final CoreAppFeign sessionEnrollmentFeign;

    private final NotificationSessionEnrollmentRepository notificationSessionEnrollmentRepository;

    private final NotificationSlotSignatureRepository notificationSlotSignatureRepository;

    private final UserService userService;

    private final RabbitMqEmailPublisher rabbitMqEmailPublisher;
    private final NotificationParameterRepository notificationParameterRepository;

    public void createSubscribeNotification(NotificationSessionEnrollmentRequestModel notificationSessionEnrollmentRequestModel) {
        ResponseEntity<SessionEnrollmentFeignResponse> response =
                sessionEnrollmentFeign.getSessionEnrollment(notificationSessionEnrollmentRequestModel.getSessionEnrollmentId());

        NotificationSessionEnrollment notification = NotificationSessionEnrollment.create(notificationSessionEnrollmentRequestModel.getNotificationType(), null, notificationSessionEnrollmentRequestModel);
        notification.markSend();
        notificationSessionEnrollmentRepository.save(notification);

        EmailMessage emailMessage = buildSubscriptionEmail(response.getBody());

        rabbitMqEmailPublisher.publish(emailMessage);
    }

    public void createUnsubscribeNotification(NotificationSessionEnrollmentRequestModel notificationSessionEnrollmentRequestModel) {
        ResponseEntity<SessionEnrollmentFeignResponse> response =
                sessionEnrollmentFeign.getSessionEnrollment(notificationSessionEnrollmentRequestModel.getSessionEnrollmentId());

        NotificationSessionEnrollment notification = NotificationSessionEnrollment.create(notificationSessionEnrollmentRequestModel.getNotificationType(), null, notificationSessionEnrollmentRequestModel);
        notification.markSend();
        notificationSessionEnrollmentRepository.save(notification);

        EmailMessage emailMessage = buildUnSubscriptionEmail(response.getBody());
        rabbitMqEmailPublisher.publish(emailMessage);
    }

    public void createScheduleNotification(NotificationSessionEnrollmentRequestModel notificationSessionEnrollmentRequestModel) {
        NotificationSessionEnrollment notification = NotificationSessionEnrollment.create(notificationSessionEnrollmentRequestModel.getNotificationType(), notificationSessionEnrollmentRequestModel.getScheduledAt(), notificationSessionEnrollmentRequestModel);
        notificationSessionEnrollmentRepository.save(notification);
    }

    public void createFailedNotification(NotificationSessionEnrollmentRequestModel notificationSessionEnrollmentRequestModel, String message) {
        NotificationSessionEnrollment notification = NotificationSessionEnrollment.create(notificationSessionEnrollmentRequestModel.getNotificationType(), LocalDateTime.now(), notificationSessionEnrollmentRequestModel);
        notification.markFailed(message);
        notificationSessionEnrollmentRepository.save(notification);
    }

    public EmailMessage buildSubscriptionEmail(
            SessionEnrollmentFeignResponse enrollment
    ) {
        return EmailMessage.builder()
                .to(enrollment.getEmployee().getEmail())
                .subject("Session Enrollment subscripbe")
                .body("Vous avez été inscrit")
                .build();
    }

    public EmailMessage buildUnSubscriptionEmail(
            SessionEnrollmentFeignResponse enrollment
    ) {
        return EmailMessage.builder()
                .to(enrollment.getEmployee().getEmail())
                .subject("Session Enrollment unsubscription " + enrollment.getSession().getTraining().getTitle())
                .body("Vous avez été désinscrit")
                .build();
    }

    public Page<NotificationParameter> getNotificationParameters(Pageable pageable) {
        Long companyId = userService.getCompanyIdOfAuthenticatedUser();
        return notificationParameterRepository.findAllByCompanyId(companyId, pageable);
    }

    public void enableNotificationParameter(Long id, boolean enable) {
    }
}
