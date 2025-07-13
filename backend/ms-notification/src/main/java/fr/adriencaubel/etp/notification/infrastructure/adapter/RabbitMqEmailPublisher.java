package fr.adriencaubel.etp.notification.infrastructure.adapter;

import fr.adriencaubel.etp.notification.parameters.domain.email.EmailMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RabbitMqEmailPublisher {
    private final RabbitTemplate rabbit;
    @Value("${rabbitmq.exchange.email}")
    private String exchange;
    @Value("${rabbitmq.routing.key.email}")
    private String routingKey;

    public void publish(EmailMessage msg) {
        rabbit.convertAndSend(exchange, routingKey, msg);
    }
}
