package fr.adriencaubel.trainingplan.signature.application.dto;

import fr.adriencaubel.trainingplan.signature.domain.SlotSignature;
import fr.adriencaubel.trainingplan.signature.domain.SlotSignatureStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class SlotSignatureResponseModel {
    private Long id;
    private Long sessionId;
    private LocalDate slotDate;
    @Enumerated(EnumType.STRING)
    private SlotSignature.Periode periode;
    private String token;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private SlotSignatureStatus status;

    public static SlotSignatureResponseModel toDto(SlotSignature slotSignature) {
        SlotSignatureResponseModel dto = new SlotSignatureResponseModel();
        dto.setId(slotSignature.getId());
        dto.setSessionId(slotSignature.getSession().getId());
        dto.setSlotDate(slotSignature.getDateCreneau());
        dto.setPeriode(slotSignature.getPeriode());
        dto.setToken(slotSignature.getToken());
        dto.setCreatedAt(slotSignature.getCreatedAt());
        dto.setExpiresAt(slotSignature.getExpiresAt());
        dto.setStatus(slotSignature.getSlotSignatureStatus());
        return dto;
    }
}
