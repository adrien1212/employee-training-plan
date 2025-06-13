package fr.adriencaubel.trainingplan.signature.infrastructure;

import fr.adriencaubel.trainingplan.signature.application.SignatureService;
import fr.adriencaubel.trainingplan.signature.application.SlotManagementService;
import fr.adriencaubel.trainingplan.signature.application.dto.EnrollmentSignatureStatus;
import fr.adriencaubel.trainingplan.signature.application.dto.SignatureResponseModel;
import fr.adriencaubel.trainingplan.signature.domain.Signature;
import fr.adriencaubel.trainingplan.signature.domain.SlotSignature;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/signatures")
@RequiredArgsConstructor
public class SignatureController {

    private final SlotManagementService slotManagementService;
    private final SignatureService signatureService;

    @GetMapping
    public ResponseEntity<Page<SignatureResponseModel>> getSignatures(@RequestParam(required = false) Long sessionId, @RequestParam(required = false) Long sessionEnrollmentId, @RequestParam(required = false) Long employeeId, Pageable pageable) {
        Page<Signature> signatures = signatureService.getAllSignatures(sessionId, sessionEnrollmentId, employeeId, pageable);
        Page<SignatureResponseModel> models = signatures.map(SignatureResponseModel::toDto);
        return ResponseEntity.ok(models);
    }

    @GetMapping("/status/{sessionEnrollmentId}")
    public ResponseEntity<EnrollmentSignatureStatus> getStatusSignature(@PathVariable Long sessionEnrollmentId) {
        EnrollmentSignatureStatus enrollmentSignatureStatus = slotManagementService.getSignatureStatus(sessionEnrollmentId);
        return ResponseEntity.ok(enrollmentSignatureStatus);
    }


    @GetMapping("/missing/{sessionEnrollmentId}")
    public List<Long> postSignature(@PathVariable Long sessionEnrollmentId) {
        List<SlotSignature> slotSignature = slotManagementService.findMissingSignaturesForEnrollment(sessionEnrollmentId);
        return slotSignature.stream().map(ss -> ss.getId()).collect(Collectors.toList());
    }
}
