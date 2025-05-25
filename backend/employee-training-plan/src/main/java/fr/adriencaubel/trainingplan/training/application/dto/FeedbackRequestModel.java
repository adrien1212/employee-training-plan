package fr.adriencaubel.trainingplan.training.application.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackRequestModel {
    private int rating;
    private String comment;
}
