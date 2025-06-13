package fr.adriencaubel.trainingplan.signature.application.dto;

import fr.adriencaubel.trainingplan.signature.domain.Signature;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SignatureResponseModel {
    private Long id;
    private String signature;
    private LocalDateTime signatureDate;
    private Long sessionEnrollmentId;
    private Long slotSignatureId;

    public static SignatureResponseModel toDto(Signature signature) {
        SignatureResponseModel signatureResponseModel = new SignatureResponseModel();
        signatureResponseModel.setId(signature.getId());
        signatureResponseModel.setSignature(signature.getSignature());
        signatureResponseModel.setSignatureDate(signature.getSignatureDate());
        signatureResponseModel.setSessionEnrollmentId(signature.getSessionEnrollment().getId());
        signatureResponseModel.setSlotSignatureId(signature.getSlotSignature().getId());
        return signatureResponseModel;
    }
}
