package fr.adriencaubel.trainingplan.signature.infrastructure;

import fr.adriencaubel.trainingplan.signature.application.SignatureService;
import fr.adriencaubel.trainingplan.signature.application.SlotManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/public/signature")
@RequiredArgsConstructor
public class PublicSignatureController {

    private final SignatureService signatureService;
    private final SlotManagementService slotManagementService;

/*    @PostMapping
    public void postSignature(@RequestBody SignatureRequestModel signatureRequestModel) {
        Signature signature = signatureService.signer(signatureRequestModel);
    }*/
}
