package fr.adriencaubel.etp.notification.feedback.service;

import fr.adriencaubel.etp.notification.config.feign.CoreAppFeign;
import fr.adriencaubel.etp.notification.config.feign.dto.FeedbackFeignResponse;
import fr.adriencaubel.etp.notification.feedback.domain.NotificationFeedback;
import fr.adriencaubel.etp.notification.feedback.listener.NotificationFeedbackRequestModel;
import fr.adriencaubel.etp.notification.feedback.repository.NotificationFeedbackRepository;
import fr.adriencaubel.etp.notification.infrastructure.adapter.RabbitMqEmailPublisher;
import fr.adriencaubel.etp.notification.parameters.domain.email.EmailMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationFeedbackService {

    private final NotificationFeedbackRepository notificationFeedbackRepository;

    private final CoreAppFeign coreAppFeign;

    private final RabbitMqEmailPublisher rabbitMqEmailPublisher;

    public void createRelanceNotification(NotificationFeedbackRequestModel notificationFeedbackRequestModel) {
        NotificationFeedback notificationFeedback = NotificationFeedback.create(notificationFeedbackRequestModel);

        FeedbackFeignResponse feedback =
                coreAppFeign.getFeedbackById(notificationFeedbackRequestModel.getFeedbackId()).getBody();

        String destinataire = feedback.getSessionEnrollment().getEmployee().getEmail();

        EmailMessage emailMessage =
                EmailMessage.builder()
                        .to(destinataire)
                        .subject("Vous pouvez donner votre avis sur la formation reçue")
                        .body("Votre formation" + feedback.getSessionEnrollment().getSession().getTraining().getTitle() + " votre token " + feedback.getFeedbackToken())
                        .build();
        rabbitMqEmailPublisher.publish(emailMessage);

        notificationFeedbackRepository.save(notificationFeedback);
    }
}
