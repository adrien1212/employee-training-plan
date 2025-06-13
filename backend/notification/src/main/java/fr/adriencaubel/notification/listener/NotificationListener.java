package fr.adriencaubel.notification.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationListener {

    @RabbitListener(queues = "${rabbitmq.queue.commands}", containerFactory = "rabbitListenerContainerFactory")
    public void handleNotificationCommands(NotificationDto data) {
        try {
            log.info("Received notification message: {}", data);

        } catch (Exception e) {
            log.error("Error processing notification message: {}", data, e);
        }
    }

    @RabbitListener(queues = "${rabbitmq.queue.commands}", containerFactory = "rabbitListenerContainerFactory")
    public void handleNotificationCommands2(NotificationDto2 data) {
        try {
            log.info("Received NotificationDto2 message: {}", data);

        } catch (Exception e) {
            log.error("Error processing NotificationDto2 message: {}", data, e);
        }
    }
}