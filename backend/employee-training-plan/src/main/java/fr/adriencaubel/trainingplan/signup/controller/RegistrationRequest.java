package fr.adriencaubel.trainingplan.signup.controller;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistrationRequest {
    private String companyName;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
}
