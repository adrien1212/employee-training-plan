package fr.adriencaubel.trainingplan.signature.infrastructure;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignatureRequestModel {
    @NotNull
    private String slotToken;
    @NotNull
    private String sessionEnrollmentToken;
    @NotNull
    private String signature;
}
