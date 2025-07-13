package fr.adriencaubel.trainingplan.signature.application;

import fr.adriencaubel.trainingplan.signature.domain.Signature;
import fr.adriencaubel.trainingplan.signature.domain.SlotSignature;
import fr.adriencaubel.trainingplan.signature.infrastructure.SignatureRepository;
import fr.adriencaubel.trainingplan.signature.infrastructure.SignatureRequestModel;
import fr.adriencaubel.trainingplan.signature.infrastructure.SignatureSpecification;
import fr.adriencaubel.trainingplan.signature.infrastructure.SlotSignatureRepository;
import fr.adriencaubel.trainingplan.training.application.SessionEnrollmentService;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SignatureService {
    private final SignatureRepository signatureRepository;
    private final SessionEnrollmentService sessionEnrollmentService;
    private final SlotManagementService slotManagementService;
    private final SlotSignatureRepository slotSignatureRepository;

    public Page<Signature> getAllSignatures(Long sessionId, Long enrollmentId, Long employeeId, Pageable pageable) {
        Specification<Signature> specification = SignatureSpecification.filter(sessionId, enrollmentId, employeeId);
        return signatureRepository.findAll(specification, pageable);
    }

    @Transactional
    public void signer(SignatureRequestModel signatureRequestModel) {
        SessionEnrollment sessionEnrollment = sessionEnrollmentService.findByAccessToken(signatureRequestModel.getSessionEnrollmentToken());
        SlotSignature slotSignature = slotManagementService.findBySlotAccessToken(signatureRequestModel.getSlotToken());

        slotSignature.signBy(sessionEnrollment, signatureRequestModel.getSignature());

        slotSignatureRepository.save(slotSignature);
    }
    
    public Boolean exist(Long slotSignatureId, Long sessionEnrollmentId) {
        return signatureRepository.existsBySlotSignatureIdAndSessionEnrollmentId(slotSignatureId, sessionEnrollmentId);
    }
}
