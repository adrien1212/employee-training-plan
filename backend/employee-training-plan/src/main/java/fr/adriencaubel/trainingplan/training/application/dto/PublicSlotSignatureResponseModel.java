package fr.adriencaubel.trainingplan.training.application.dto;

import fr.adriencaubel.trainingplan.signature.domain.SlotSignature;
import fr.adriencaubel.trainingplan.signature.domain.SlotSignatureStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PublicSlotSignatureResponseModel {
    private Long id;
    private Long sessionId;
    private String trainingName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private LocalDate slotDate;
    @Enumerated(EnumType.STRING)
    private SlotSignature.Periode periode;
    private String token;
    private SlotSignatureStatus status;

    public static PublicSlotSignatureResponseModel toDto(SlotSignature slotSignature) {
        PublicSlotSignatureResponseModel dto = new PublicSlotSignatureResponseModel();
        dto.setId(slotSignature.getId());
        dto.setSessionId(slotSignature.getSession().getId());
        dto.setTrainingName(slotSignature.getSession().getTraining().getTitle());
        dto.setStartDate(slotSignature.getSession().getStartDate());
        dto.setEndDate(slotSignature.getSession().getEndDate());
        dto.setLocation(slotSignature.getSession().getLocation());
        dto.setSlotDate(slotSignature.getDateCreneau());
        dto.setPeriode(slotSignature.getPeriode());
        dto.setToken(slotSignature.getToken());
        dto.setStatus(slotSignature.getSlotSignatureStatus());
        return dto;
    }
}
