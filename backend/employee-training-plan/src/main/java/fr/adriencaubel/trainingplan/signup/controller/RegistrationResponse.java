package fr.adriencaubel.trainingplan.signup.controller;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistrationResponse {
    private Long companyId;
    private Long userId;
    private String message;

    public RegistrationResponse(Long id, Long id1, String registrationSuccessful) {
        this.companyId = id;
        this.userId = id1;
        this.message = registrationSuccessful;
    }
}
