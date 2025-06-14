package fr.adriencaubel.trainingplan.signature.application;

import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.signature.domain.Signature;
import fr.adriencaubel.trainingplan.signature.domain.SlotSignature;
import fr.adriencaubel.trainingplan.signature.domain.SlotSignatureStatus;
import fr.adriencaubel.trainingplan.signature.infrastructure.SignatureRepository;
import fr.adriencaubel.trainingplan.signature.infrastructure.SignatureRequestModel;
import fr.adriencaubel.trainingplan.signature.infrastructure.SignatureSpecification;
import fr.adriencaubel.trainingplan.training.application.SessionEnrollmentService;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SignatureService {
    private final SignatureRepository signatureRepository;
    private final SessionEnrollmentService sessionEnrollmentService;
    private final SlotManagementService slotManagementService;

    public Page<Signature> getAllSignatures(Long sessionId, Long enrollmentId, Long employeeId, Pageable pageable) {
        Specification<Signature> specification = SignatureSpecification.filter(sessionId, enrollmentId, employeeId);
        return signatureRepository.findAll(specification, pageable);
    }

    @Transactional
    public Signature signer(SignatureRequestModel signatureRequestModel) {
        SessionEnrollment sessionEnrollment = sessionEnrollmentService.findByAccessToken(signatureRequestModel.getSessionEnrollmentToken());
        SlotSignature slotSignature = slotManagementService.findBySlotAccessToken(signatureRequestModel.getSlotToken());

        if (!canSign(slotSignature, sessionEnrollment)) {
            throw new DomainException("Token " + signatureRequestModel.getSessionEnrollmentToken() + " not allowed");
        }

        Signature signature = new Signature(slotSignature, sessionEnrollment, signatureRequestModel.getSignature());

        return signatureRepository.save(signature);
    }

    /*    @Transactional
        public Signature signer(SignatureRequestModel signatureRequestModel) {
            SessionEnrollment enrollment = sessionEnrollmentService.findByAccessToken(signatureRequestModel.getSessionEnrollmentToken());
            SlotSignature slotSignature = slotManagementService.findByToken(signatureRequestModel.getSlotToken());

            if (enrollment == null || slotSignature == null) {
                throw new DomainException("Token " + signatureRequestModel.getSessionEnrollmentToken() + " not found");
            }

            if (!canSign(slotSignature, enrollment)) {
                throw new DomainException("Token " + signatureRequestModel.getSessionEnrollmentToken() + " not allowed");
            }

            Signature signature = new Signature();
            signature.setSignature(signatureRequestModel.getSignature());
            signature.setSlotSignature(slotSignature);
            signature.setSessionEnrollment(enrollment);
            signature.setSignatureDate(LocalDateTime.now());

            signatureRepository.save(signature);

            return signature;
        }
    */
    public boolean canSign(SlotSignature slot, SessionEnrollment enrollment) {
        // 1) Vérification de l'état du créneau
        if (slot.getSlotSignatureStatus() != SlotSignatureStatus.OPEN || (slot.getExpiresAt() != null && slot.getExpiresAt().isBefore(LocalDateTime.now()))) {
            throw new DomainException("Le créneau est fermé ou expiré");
        }

        // 3) Vérifier l'appartenance de la session
        if (!enrollment.getSession().getId().equals(slot.getSession().getId())) {
            throw new DomainException("Token non valide pour cette session");
        }
        // 4) Contrôle de doublon
        boolean alreadySigned = slot.getSignatures().stream()
                .anyMatch(sig -> sig.getSessionEnrollment().getId().equals(enrollment.getId()));
        if (alreadySigned) {
            throw new DomainException("Déjà signé pour ce créneau");
        }
        return true;
    }

    public Boolean exist(Long slotSignatureId, Long sessionEnrollmentId) {
        return signatureRepository.existsBySlotSignatureIdAndSessionEnrollmentId(slotSignatureId, sessionEnrollmentId);
    }
}
