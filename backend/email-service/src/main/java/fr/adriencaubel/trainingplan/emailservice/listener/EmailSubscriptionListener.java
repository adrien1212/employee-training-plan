package fr.adriencaubel.trainingplan.emailservice.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.adriencaubel.trainingplan.emailservice.dto.EmailAttachmentDto;
import fr.adriencaubel.trainingplan.emailservice.dto.EmailMessageDto;
import fr.adriencaubel.trainingplan.emailservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailSubscriptionListener {

    private final EmailService emailService;

    @RabbitListener(queues = "${rabbitmq.queue.subscription}")
    public void handleEmailSubscription(String data) {
        try {
            log.info("Received email message: {}", data);

            EmailMessageDto emailMessage = new ObjectMapper().readValue(data, EmailMessageDto.class);
            emailService.sendEmail(emailMessage);
        } catch (Exception e) {
            log.error("Error processing email message: {}", data, e);
        }
    }
}
