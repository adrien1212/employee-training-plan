package fr.adriencaubel.notification.listener;

import fr.adriencaubel.notification.domain.EmailMessageDto;
import fr.adriencaubel.notification.domain.Notification;
import fr.adriencaubel.notification.domain.NotificationRepository;
import fr.adriencaubel.notification.feign.SessionEnrollmentFeign;
import fr.adriencaubel.notification.listener.dto.NotificationRequestModel;
import fr.adriencaubel.notification.listener.dto.SubscriptionNotificationPayload;
import fr.adriencaubel.notification.listener.dto.TrainerNotificationPayload;
import fr.adriencaubel.notification.type.SessionEnrollmentRequestModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;


@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationListener {

    private final RabbitTemplate rabbitTemplate;

    private final SessionEnrollmentFeign sessionEnrollmentFeign;

    private final NotificationRepository notificationRepository;

    @Value("${rabbitmq.exchange.email}")
    private String emailExchange;

    @Value("${rabbitmq.routing.key.email}")
    private String emailRoutingKey;

    @RabbitListener(queues = "${rabbitmq.queues.session-enrollment}",
                    containerFactory = "rabbitListenerContainerFactory")
    public void handleSubscribeNotification(NotificationRequestModel<SubscriptionNotificationPayload> notificationRequestModel) {

        try {
            log.debug("Received notification message: {}", notificationRequestModel);

            log.debug("Notification commands received: " + notificationRequestModel);
            if(notificationRequestModel.getScheduledAt() == null || notificationRequestModel.getScheduledAt().plusMinutes(10).isBefore(LocalDateTime.now())) {
                // planification avant now() ou planification + 10min avant now() alors traiter le message

                switch (notificationRequestModel.getNotificationType()) {
                    case SUBSCRIBE_TO_SESSION -> {
                        ResponseEntity<SessionEnrollmentRequestModel> response =
                                sessionEnrollmentFeign.getSessionEnrollment(notificationRequestModel.getPayload().getSessionEnrollmentId());

                        EmailMessageDto dto = createSubscriptionEmailDTO(response.getBody());
                        rabbitTemplate.convertAndSend(
                                emailExchange,
                                emailRoutingKey,
                                dto
                        );
                    }
                    case UNSUBSCRIBE_TO_SESSION -> {
                        ResponseEntity<SessionEnrollmentRequestModel> response =
                                sessionEnrollmentFeign.getSessionEnrollment(notificationRequestModel.getPayload().getSessionEnrollmentId());

                        EmailMessageDto dto = createUnsubscriptionEmailDTO(response.getBody());
                        rabbitTemplate.convertAndSend(
                                emailExchange,
                                emailRoutingKey,
                                dto
                        );
                    }
                }

                Notification notification = Notification.create(notificationRequestModel.getNotificationType(), null, notificationRequestModel.getPayload());
                notification.markSend();
                notificationRepository.save(notification);
            } else {
                Notification notification = Notification.create(notificationRequestModel.getNotificationType(), notificationRequestModel.getScheduledAt(), notificationRequestModel.getPayload());
                notificationRepository.save(notification);
            }
        } catch (Exception e) {
            Notification notification = Notification.create(notificationRequestModel.getNotificationType(), LocalDateTime.now(), notificationRequestModel.getPayload());
            notification.markFailed(e.getMessage());
            notificationRepository.save(notification);
            log.error("Error processing notification message: {}", notificationRequestModel, e.getStackTrace());
        }
    }

    @RabbitListener(queues = "${rabbitmq.queues.trainer}", containerFactory = "rabbitListenerContainerFactory")
    public void handleTrainerNotification(NotificationRequestModel<TrainerNotificationPayload> notificationRequestModel) {
        System.out.println(notificationRequestModel.getPayload().getSessionId());
    }

    private EmailMessageDto createSubscriptionEmailDTO(SessionEnrollmentRequestModel sessionEnrollmentRequestModel) {
        EmailMessageDto dto = new EmailMessageDto();
        dto.setTo(sessionEnrollmentRequestModel.getEmployee().getEmail());
        dto.setSubject("Vous venez d'être inscrit au cours " + sessionEnrollmentRequestModel.getSession().getTraining().getTitle());
        dto.setHtml(false);
        dto.setBody("Bienvenue à votre cours");
        return dto;
    }

    private EmailMessageDto createUnsubscriptionEmailDTO(SessionEnrollmentRequestModel sessionEnrollmentRequestModel) {
        EmailMessageDto dto = new EmailMessageDto();
        dto.setTo(sessionEnrollmentRequestModel.getEmployee().getEmail());
        dto.setSubject("Vous venez d'être désinscrit au cours " + sessionEnrollmentRequestModel.getSession().getTraining().getTitle());
        dto.setHtml(false);
        dto.setBody("Suppresion de votre cours");
        return dto;
    }
}