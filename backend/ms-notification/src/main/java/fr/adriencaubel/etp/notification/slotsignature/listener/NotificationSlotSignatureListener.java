package fr.adriencaubel.etp.notification.slotsignature.listener;

import fr.adriencaubel.etp.notification.slotsignature.service.NotificationSlotSignatureService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationSlotSignatureListener {

    private final NotificationSlotSignatureService notificationSlotSignatureService;

    @RabbitListener(queues = "${rabbitmq.queues.slot-signature}",
            containerFactory = "rabbitListenerContainerFactory")
    public void handleSlotSignatureNotification(NotificationSlotSignatureRequestModel notificationRequestModel) {
        log.debug("Received notification message: {}", notificationRequestModel);

        switch (notificationRequestModel.getNotificationType()) {
            case SLOT_SIGNATURE_OPEN ->
                    notificationSlotSignatureService.createSlotSignatureOpenNotification(notificationRequestModel);
        }
    }
}


