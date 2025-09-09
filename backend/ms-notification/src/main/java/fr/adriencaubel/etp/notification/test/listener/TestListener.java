package fr.adriencaubel.etp.notification.test.listener;

import fr.adriencaubel.etp.notification.infrastructure.adapter.RabbitMqEmailPublisher;
import fr.adriencaubel.etp.notification.parameters.domain.email.EmailMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
@Slf4j
public class TestListener {

    private final RabbitMqEmailPublisher rabbitMqEmailPublisher;

    @RabbitListener(queues = "${rabbitmq.queues.test}",
            containerFactory = "rabbitListenerContainerFactory")
    public void handleTestotification(EmailRequestModel emailRequestModel) {
        log.debug("Received test notification message");

        EmailMessage emailMessage =
                EmailMessage.builder()
                        .to(emailRequestModel.getToEmail())
                        .subject("Test Email")
                        .body("Test Email")
                        .build();
        rabbitMqEmailPublisher.publish(emailMessage);
    }
}


