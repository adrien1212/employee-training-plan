package fr.adriencaubel.trainingplan.signature.infrastructure;

import fr.adriencaubel.trainingplan.signature.application.SlotManagementService;
import fr.adriencaubel.trainingplan.signature.application.dto.SlotSignatureResponseModel;
import fr.adriencaubel.trainingplan.signature.domain.SlotSignature;
import fr.adriencaubel.trainingplan.training.application.dto.SessionEnrollmentResponseModel;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/slots-signature")
@RequiredArgsConstructor
public class SlotController {

    private final SlotManagementService slotManagementService;

    @GetMapping("/{id}")
    public ResponseEntity<SlotSignatureResponseModel> getSlotByID(@PathVariable Long id) {
        SlotSignature slotSignature = slotManagementService.findById(id);
        return ResponseEntity.ok(SlotSignatureResponseModel.toDto(slotSignature));
    }

    @GetMapping
    public ResponseEntity<Page<SlotSignatureResponseModel>> getSlot(@RequestParam(required = true) Long sessionId, Pageable pageable) {
        Page<SlotSignature> slotSignatures = slotManagementService.findAll(sessionId, pageable);
        return ResponseEntity.ok(slotSignatures.map(SlotSignatureResponseModel::toDto));
    }

    @PostMapping("{id}/open-signature")
    public ResponseEntity<SlotSignatureResponseModel> ouvrirSignature(@PathVariable Long id) {
        SlotSignature slotSignature = slotManagementService.ouvrirSignature(id);
        return ResponseEntity.ok(SlotSignatureResponseModel.toDto(slotSignature));
    }

    @PostMapping("{id}/close-signature")
    public ResponseEntity<SlotSignatureResponseModel> fermerSignature(@PathVariable Long id) {
        SlotSignature slotSignature = slotManagementService.fermerSignature(id);
        return ResponseEntity.ok(SlotSignatureResponseModel.toDto(slotSignature));
    }


    @GetMapping("/{id}/missing-signatures")
    public ResponseEntity<Page<SessionEnrollmentResponseModel>> getMissingSignature(@PathVariable Long id, Pageable pageable) {
        Page<SessionEnrollment> sessionEnrollments = slotManagementService.findMissingSignaturesForSlot(id, pageable);
        return ResponseEntity.ok(sessionEnrollments.map(SessionEnrollmentResponseModel::toDto));
    }
}
