package fr.adriencaubel.trainingplan.training.application.dto;

import fr.adriencaubel.trainingplan.signature.domain.ModeSignature;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateSessionRequestModel {
    private String alias;
    private LocalDate startDate;
    private LocalDate endDate;
    private SessionStatus sessionStatus;
    private String location;
    private ModeSignature modeSignature;
    private Long trainerId;
}
