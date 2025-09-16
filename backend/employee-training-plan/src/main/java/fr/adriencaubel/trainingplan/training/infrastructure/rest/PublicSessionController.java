package fr.adriencaubel.trainingplan.training.infrastructure.rest;

import fr.adriencaubel.trainingplan.signature.domain.SlotSignature;
import fr.adriencaubel.trainingplan.training.application.SessionService;
import fr.adriencaubel.trainingplan.training.application.dto.PublicSessionEnrollmentResponseModel;
import fr.adriencaubel.trainingplan.training.application.dto.PublicSessionResponseModel;
import fr.adriencaubel.trainingplan.training.application.dto.PublicSlotSignatureResponseModel;
import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("v1/public/sessions")
@RequiredArgsConstructor
public class PublicSessionController {
    private final SessionService sessionService;

    @GetMapping("/{trainerAccessToken}")
    public ResponseEntity<PublicSessionResponseModel> getSessionById(@PathVariable String trainerAccessToken) {
        Session session = sessionService.getSessionByAccessToken(trainerAccessToken);
        return ResponseEntity.ok(PublicSessionResponseModel.toDto(session));
    }

    @GetMapping("/{trainerAccessToken}/sessions-enrollment")
    public ResponseEntity<Page<PublicSessionEnrollmentResponseModel>> getSessionEnrollmentByTrainerAccessToken(@PathVariable String trainerAccessToken, Pageable pageable) {
        Page<SessionEnrollment> sessionEnrollments = sessionService.getSessionEnrollmentByTrainerAccessToken(trainerAccessToken, pageable);

        return ResponseEntity.ok(new PageImpl<>(sessionEnrollments.stream().map(PublicSessionEnrollmentResponseModel::toDto).toList()));
    }

    @GetMapping("/{trainerAccessToken}/slots-signature")
    public ResponseEntity<Page<PublicSlotSignatureResponseModel>> getSlotSignatureByTrainerAccessToken(@PathVariable String trainerAccessToken, Pageable pageable) {
        Page<SlotSignature> slotSignatures = sessionService.getSlotSignatureByTrainerAccessToken(trainerAccessToken, pageable);

        return ResponseEntity.ok(new PageImpl<>(slotSignatures.stream().map(PublicSlotSignatureResponseModel::toDto).toList()));
    }
}
