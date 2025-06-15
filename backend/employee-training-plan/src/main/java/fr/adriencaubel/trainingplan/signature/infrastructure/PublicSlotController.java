package fr.adriencaubel.trainingplan.signature.infrastructure;

import fr.adriencaubel.trainingplan.signature.application.SlotManagementService;
import fr.adriencaubel.trainingplan.signature.application.dto.SlotSignatureResponseModel;
import fr.adriencaubel.trainingplan.signature.domain.SlotSignature;
import fr.adriencaubel.trainingplan.training.application.dto.PublicSlotSignatureResponseModel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/public/slots-signature")
@RequiredArgsConstructor
public class PublicSlotController {
    private final SlotManagementService slotManagementService;

    @GetMapping("{slotAccessToken}")
    public ResponseEntity<PublicSlotSignatureResponseModel> getSlot(@PathVariable("slotAccessToken") String slotAccessToken) {
        SlotSignature slotSignature = slotManagementService.findBySlotAccessToken(slotAccessToken);
        return ResponseEntity.ok(PublicSlotSignatureResponseModel.toDto(slotSignature));
    }

    @PostMapping("/open-signature/{slotAccessToken}")
    public ResponseEntity<SlotSignatureResponseModel> ouvrirSignature(@PathVariable("slotAccessToken") String slotAccessToken) {
        SlotSignature slotSignature = slotManagementService.ouvrirSignature(slotAccessToken);
        return ResponseEntity.ok(SlotSignatureResponseModel.toDto(slotSignature));
    }
}
