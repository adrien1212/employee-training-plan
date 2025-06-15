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

import javax.management.Notification;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailSubscriptionListener {

    private final EmailService emailService;

    @RabbitListener(queues = "${rabbitmq.queue.email}")
    public void handleEmailSubscription(EmailMessageDto emailMessage) {
        try {
            log.info("Received email message: {}", emailMessage);
            emailService.sendEmail(emailMessage);
        } catch (Exception e) {
            log.error("Error processing email message: {}", emailMessage, e);
        }
    }
}
