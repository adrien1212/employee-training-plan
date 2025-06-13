package fr.adriencaubel.trainingplan.training.infrastructure.adapter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.adriencaubel.trainingplan.common.exception.EmailNotificationException;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.application.EmailNotificationPort;
import fr.adriencaubel.trainingplan.training.domain.Session;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class RabbitMQEmailNotificationAdapter implements EmailNotificationPort {
    private final RabbitTemplate rabbitTemplate;

    private final ObjectMapper objectMapper;

    @Value("${rabbitmq.exchange.email}")
    private String emailExchange;

    @Value("${rabbitmq.routing.subscription}")
    private String subscriptionRoutingKey;

    @Override
    public void sendTrainingSubscriptionEmail(Employee employee, Session session) {
        try {
            EmailMessageDto dto = createSubscriptionEmailDTO(employee, session);
            rabbitTemplate.convertAndSend(
                    emailExchange,
                    subscriptionRoutingKey,
                    objectMapper.writeValueAsString(dto)
            );
        } catch (JsonProcessingException e) {
            // Log error, potentially throw a domain-specific exception
            throw new EmailNotificationException("Failed to send subscription email", e);
        }
    }

    @Override
    public void sendFeedbackEmail(Employee employee, Session session, String feedbackToken) {
        try {
            EmailMessageDto dto = createFeedbackEmailDTO(employee, session, feedbackToken);
            rabbitTemplate.convertAndSend(
                    emailExchange,
                    subscriptionRoutingKey,
                    objectMapper.writeValueAsString(dto)
            );
        } catch (JsonProcessingException e) {
            // Log error, potentially throw a domain-specific exception
            throw new EmailNotificationException("Failed to send subscription email", e);
        }
    }

    private EmailMessageDto createFeedbackEmailDTO(Employee employee, Session session, String feedbackToken) {
        EmailMessageDto dto = new EmailMessageDto();
        dto.setTo(employee.getEmail());
        dto.setSubject("La session " + session.getTraining().getTitle() + " est finie, vous pouvez maintenant donner votre avis avec le token suivant + " + feedbackToken);
        dto.setHtml(false);
        dto.setBody("Bienvenue à votre cours");
        return dto;
    }

    // Helper methods to create DTOs
    private EmailMessageDto createSubscriptionEmailDTO(Employee employee, Session session) {
        EmailMessageDto dto = new EmailMessageDto();
        dto.setTo(employee.getEmail());
        dto.setSubject("Vous venez d'être inscrit au cours " + session.getTraining().getTitle());
        dto.setHtml(false);
        dto.setBody("Bienvenue à votre cours");
        return dto;
    }
}
