package fr.adriencaubel.trainingplan.training.infrastructure.adapter;

import fr.adriencaubel.trainingplan.training.application.NotificationPort;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import fr.adriencaubel.trainingplan.training.infrastructure.adapter.dto.NotificationSessionEnrollmentRequestModel;
import fr.adriencaubel.trainingplan.training.infrastructure.adapter.dto.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
public class RabbitMQNotificationAdapter implements NotificationPort {
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.commands}")
    private String commandsExchange;

    @Value("${rabbitmq.routing-keys.session-enrollment}")
    private String sessionEnrollmentKey;

    @Override
    public void sendSubscribeNotification(SessionEnrollment sessionEnrollment) {
        NotificationSessionEnrollmentRequestModel notificationRequestModel = new NotificationSessionEnrollmentRequestModel(NotificationType.SUBSCRIBE_TO_SESSION, null, sessionEnrollment.getId());

        rabbitTemplate.convertAndSend(
                commandsExchange,
                sessionEnrollmentKey,
                notificationRequestModel
        );
    }

    @Override
    public void sendUnsubscribeNotification(SessionEnrollment sessionEnrollment) {
        NotificationSessionEnrollmentRequestModel notificationRequestModel = new NotificationSessionEnrollmentRequestModel(NotificationType.UNSUBSCRIBE_TO_SESSION, null, sessionEnrollment.getId());

        rabbitTemplate.convertAndSend(
                commandsExchange,
                sessionEnrollmentKey,
                notificationRequestModel
        );
    }

    @Override
    public void sendSessionReminderNotification(SessionEnrollment sessionEnrollment, LocalDateTime scheduledTime) {
        NotificationSessionEnrollmentRequestModel notificationRequestModel = new NotificationSessionEnrollmentRequestModel(NotificationType.SESSION_REMINDER, scheduledTime, sessionEnrollment.getId());
        rabbitTemplate.convertAndSend(
                commandsExchange,
                sessionEnrollmentKey,
                notificationRequestModel
        );
    }

}
