package fr.adriencaubel.trainingplan.training.application.dto;

import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateSessionRequestModel {
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private SessionStatus status;
}
