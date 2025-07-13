package fr.adriencaubel.trainingplan.signature.infrastructure;

import fr.adriencaubel.trainingplan.signature.application.SignatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/public/signatures")
@RequiredArgsConstructor
public class PublicSignatureController {

    private final SignatureService signatureService;

    @PostMapping
    public void postSignature(@RequestBody SignatureRequestModel signatureRequestModel) {
        signatureService.signer(signatureRequestModel);
    }
}
