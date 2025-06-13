package fr.adriencaubel.trainingplan.signature.application.dto;

import fr.adriencaubel.trainingplan.signature.domain.SlotSignature;
import lombok.Getter;
import lombok.Setter;

import java.util.Collections;
import java.util.List;

/**
 * DTO représentant le statut des signatures pour un enrollment :
 * - signedSlots : créneaux déjà signés
 * - missingSlots : créneaux non signés
 */
@Getter
@Setter
public class EnrollmentSignatureStatus {
    private final List<SlotSignatureResponseModel> signedSlots;
    private final List<SlotSignatureResponseModel> missingSlots;

    public EnrollmentSignatureStatus(List<SlotSignature> signedSlots,
                                     List<SlotSignature> missingSlots) {
        this.signedSlots = Collections.unmodifiableList(signedSlots.stream().map(SlotSignatureResponseModel::toDto).toList());
        this.missingSlots = Collections.unmodifiableList(missingSlots.stream().map(SlotSignatureResponseModel::toDto).toList());
    }

}
