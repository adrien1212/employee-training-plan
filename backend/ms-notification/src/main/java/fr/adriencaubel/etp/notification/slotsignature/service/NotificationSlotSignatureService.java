package fr.adriencaubel.etp.notification.slotsignature.service;

import fr.adriencaubel.etp.notification.config.feign.CoreAppFeign;
import fr.adriencaubel.etp.notification.config.feign.dto.SessionEnrollmentFeignResponse;
import fr.adriencaubel.etp.notification.config.feign.dto.SlotSignatureFeignResponse;
import fr.adriencaubel.etp.notification.infrastructure.adapter.RabbitMqEmailPublisher;
import fr.adriencaubel.etp.notification.slotsignature.listener.NotificationSlotSignatureRequestModel;
import fr.adriencaubel.etp.notification.parameters.domain.email.EmailMessage;
import fr.adriencaubel.etp.notification.slotsignature.domain.NotificationSlotSignature;
import fr.adriencaubel.etp.notification.slotsignature.repository.NotificationSlotSignatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationSlotSignatureService {

    private final CoreAppFeign sessionEnrollmentFeign;

    private final NotificationSlotSignatureRepository notificationSlotSignatureRepository;

    private final RabbitMqEmailPublisher rabbitMqEmailPublisher;

    public void createSlotSignatureOpenNotification(NotificationSlotSignatureRequestModel notificationRequestModel) {
        NotificationSlotSignature notificationSlotSignature = NotificationSlotSignature.create(notificationRequestModel);

        SlotSignatureFeignResponse slotSignature =
                sessionEnrollmentFeign.getSlotSignature(notificationRequestModel.getSlotSignatureId()).getBody();

        List<SessionEnrollmentFeignResponse> responseMissingSignature = sessionEnrollmentFeign.getMissingSignatures(notificationRequestModel.getSlotSignatureId()).getBody().toList();

        for(SessionEnrollmentFeignResponse sessionEnrollment : responseMissingSignature) {
            EmailMessage emailMessage =
                    EmailMessage.builder()
                            .to(sessionEnrollment.getEmployee().getEmail())
                            .subject("Slot signature ouvert")
                            .body("Rendez vous au lien /public/slot/" + slotSignature.getToken())
                    .build();
            rabbitMqEmailPublisher.publish(emailMessage);
        }

        notificationSlotSignature.markSend();
        notificationSlotSignatureRepository.save(notificationSlotSignature);
    }
}
