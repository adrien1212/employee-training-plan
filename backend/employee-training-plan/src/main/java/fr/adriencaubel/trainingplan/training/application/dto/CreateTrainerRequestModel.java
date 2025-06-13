package fr.adriencaubel.trainingplan.training.application.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTrainerRequestModel {
    private String firstName;
    private String lastName;
    private String email;
    private String speciality;
}
