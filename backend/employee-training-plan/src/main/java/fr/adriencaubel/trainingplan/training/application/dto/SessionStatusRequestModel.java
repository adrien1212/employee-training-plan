package fr.adriencaubel.trainingplan.training.application.dto;


import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SessionStatusRequestModel {

    @NotNull(message = "status must not be null")
    private SessionStatus status;
}
