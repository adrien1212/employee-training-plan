package fr.adriencaubel.trainingplan.training.infrastructure.adapter;

import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.application.NotificationPort;
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

    @Value("${rabbitmq.routing.key.create}")
    private String keyCreateExchange;

    @Override
    public void sendNotification(Employee employee) {
        NotificationDto dto = createNotification(employee);
        rabbitTemplate.convertAndSend(
                commandsExchange,
                keyCreateExchange,
                dto
        );
    }

    // Helper methods to create DTOs
    private NotificationDto createNotification(Employee employee) {
        NotificationDto dto = new NotificationDto();
        dto.setEmployeeId(employee.getId());
        dto.setType("subscribe");
        return dto;
    }
}
