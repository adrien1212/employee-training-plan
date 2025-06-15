package fr.adriencaubel.trainingplan.training.infrastructure.adapter;

import fr.adriencaubel.trainingplan.training.application.NotificationPort;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import fr.adriencaubel.trainingplan.training.infrastructure.adapter.dto.NotificationRequestModel;
import fr.adriencaubel.trainingplan.training.infrastructure.adapter.dto.NotificationType;
import fr.adriencaubel.trainingplan.training.infrastructure.adapter.dto.SubscriptionNotificationPayload;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

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
        SubscriptionNotificationPayload subscriptionNotificationPayload = new SubscriptionNotificationPayload(sessionEnrollment.getId());
        NotificationRequestModel<SubscriptionNotificationPayload> notificationRequestModel = new NotificationRequestModel<SubscriptionNotificationPayload>(NotificationType.SUBSCRIBE_TO_SESSION, null, subscriptionNotificationPayload);

        rabbitTemplate.convertAndSend(
                commandsExchange,
                sessionEnrollmentKey,
                notificationRequestModel
        );
    }

    @Override
    public void sendUnsubscribeNotification(SessionEnrollment sessionEnrollment) {
        SubscriptionNotificationPayload subscriptionNotificationPayload = new SubscriptionNotificationPayload(sessionEnrollment.getId());
        NotificationRequestModel<SubscriptionNotificationPayload> notificationRequestModel = new NotificationRequestModel<SubscriptionNotificationPayload>(NotificationType.UNSUBSCRIBE_TO_SESSION, null, subscriptionNotificationPayload);

        rabbitTemplate.convertAndSend(
                commandsExchange,
                sessionEnrollmentKey,
                notificationRequestModel
        );
    }

}
