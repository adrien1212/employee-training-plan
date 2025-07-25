package fr.adriencaubel.etp.notification.feedback.listener;

import fr.adriencaubel.etp.notification.feedback.service.NotificationFeedbackService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationFeedbackListener {

    private final NotificationFeedbackService notificationFeedbackService;

    @RabbitListener(queues = "${rabbitmq.queues.feedback}",
            containerFactory = "rabbitListenerContainerFactory")
    public void handleFeedbackSignatureNotification(NotificationFeedbackRequestModel notificationFeedbackRequestModel) {
        log.debug("Received notification message: {}", notificationFeedbackRequestModel);

        switch (notificationFeedbackRequestModel.getNotificationType()) {
            case FEEDBACK_RELANCE ->
                    notificationFeedbackService.createRelanceNotification(notificationFeedbackRequestModel);
        }
    }
}


