package fr.adriencaubel.trainingplan.training.application.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackRequestModel {
    @NotNull
    private String accessToken;
    @NotNull
    private int rating;
    private String comment;
}
