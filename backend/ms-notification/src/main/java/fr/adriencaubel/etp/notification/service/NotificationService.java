package fr.adriencaubel.etp.notification.service;

import fr.adriencaubel.etp.notification.domain.NotificationParameter;
import fr.adriencaubel.etp.notification.domain.sessionenrollment.NotificationSessionEnrollment;
import fr.adriencaubel.etp.notification.domain.sessionenrollment.NotificationSessionEnrollmentRepository;
import fr.adriencaubel.etp.notification.infrastructure.adapter.RabbitMqEmailPublisher;
import fr.adriencaubel.etp.notification.listener.requestmodel.NotificationSessionEnrollmentRequestModel;
import fr.adriencaubel.etp.notification.service.emailfactory.NotificationEmailMessageFactory;
import fr.adriencaubel.etp.notification.infrastructure.adapter.SessionEnrollmentFeign;
import fr.adriencaubel.etp.notification.domain.email.EmailMessage;
import fr.adriencaubel.etp.notification.type.SessionEnrollmentRequestModel;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SessionEnrollmentFeign sessionEnrollmentFeign;

    private final NotificationSessionEnrollmentRepository notificationSessionEnrollmentRepository;

    private final RabbitMqEmailPublisher rabbitMqEmailPublisher;

    public void createSubscribeNotification(NotificationSessionEnrollmentRequestModel notificationSessionEnrollmentRequestModel) {
        ResponseEntity<SessionEnrollmentRequestModel> response =
                sessionEnrollmentFeign.getSessionEnrollment(notificationSessionEnrollmentRequestModel.getSessionEnrollmentId());

        NotificationSessionEnrollment notification = NotificationSessionEnrollment.create(notificationSessionEnrollmentRequestModel.getNotificationType(), null, notificationSessionEnrollmentRequestModel);
        notification.markSend();
        notificationSessionEnrollmentRepository.save(notification);

        EmailMessage emailMessage = buildEmail(notification, response.getBody());

        rabbitMqEmailPublisher.publish(emailMessage);
    }

    public void createUnsubscribeNotification(NotificationSessionEnrollmentRequestModel notificationSessionEnrollmentRequestModel) {
        ResponseEntity<SessionEnrollmentRequestModel> response =
                sessionEnrollmentFeign.getSessionEnrollment(notificationSessionEnrollmentRequestModel.getSessionEnrollmentId());

        NotificationSessionEnrollment notification = NotificationSessionEnrollment.create(notificationSessionEnrollmentRequestModel.getNotificationType(), null, notificationSessionEnrollmentRequestModel);
        notification.markSend();
        notificationSessionEnrollmentRepository.save(notification);

        EmailMessage emailMessage = buildEmail(notification, response.getBody());
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

    public EmailMessage buildEmail(
            NotificationSessionEnrollment notification,
            SessionEnrollmentRequestModel enrollment
    ) {
        var builder = new NotificationEmailMessageFactory()
                .getBuilder(notification.getNotificationType());
        return builder.build(enrollment);
    }

    public Page<NotificationParameter> getNotificationParameters(Pageable pageable) {
        return null;
    }

    public void enableNotificationParameter(Long id, boolean enable) {
    }
}
