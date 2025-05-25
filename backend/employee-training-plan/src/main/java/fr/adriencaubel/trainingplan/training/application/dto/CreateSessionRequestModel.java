package fr.adriencaubel.trainingplan.training.application.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateSessionRequestModel {
    private LocalDate startDate;
    private LocalDate endDate;
}
