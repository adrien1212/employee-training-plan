package fr.adriencaubel.etp.notification.sessionenrollment.listener;

import fr.adriencaubel.etp.notification.sessionenrollment.service.NotificationSessionEnrollmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;


@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationSessionEnrollmentListener {

    private final NotificationSessionEnrollmentService notificationService;

    @RabbitListener(queues = "${rabbitmq.queues.session-enrollment}",
            containerFactory = "rabbitListenerContainerFactory")
    public void handleSubscribeNotification(NotificationSessionEnrollmentRequestModel notificationRequestModel) {

        try {
            log.debug("Received notification message: {}", notificationRequestModel);

            log.debug("Notification commands received: " + notificationRequestModel);
            if (notificationRequestModel.getScheduledAt() == null) {
                    // ne pas envoyé des notifications à une date antérieure && si la planification et dans les 10min à venir
                // planification avant now() ou planification + 10min avant now() alors traiter le message

                switch (notificationRequestModel.getNotificationType()) {
                    case SUBSCRIBE_TO_SESSION -> {
                        notificationService.createSubscribeNotification(notificationRequestModel);
                    }
                    case UNSUBSCRIBE_TO_SESSION -> {
                        notificationService.createUnsubscribeNotification(notificationRequestModel);
                    }
                    case FEEDBACK_OPEN -> {
                        notificationService.createSessionCompletedNotification(notificationRequestModel);
                    }
                }
            } else {
                if(notificationRequestModel.getScheduledAt().minusMinutes(10).isBefore(LocalDateTime.now())) {
                    notificationService.createFailedNotification(notificationRequestModel, "La planification de la notification a une date antirieure à son enregistrement à " + LocalDateTime.now());
                }

                // Envoyer la notification maintenant si elle est dans les 10min à venir
                if(notificationRequestModel.getScheduledAt().isBefore(LocalDateTime.now().plusMinutes(10))) {
                    notificationRequestModel.setScheduledAt(null);
                    handleSubscribeNotification(notificationRequestModel);
                }

                notificationService.createScheduleNotification(notificationRequestModel);
            }
        } catch (Exception e) {
            notificationService.createFailedNotification(notificationRequestModel, e.getMessage());
            log.error("Error processing notification message: {}", notificationRequestModel, e.getStackTrace());
        }
    }
}


