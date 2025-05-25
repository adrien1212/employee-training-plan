package fr.adriencaubel.trainingplan.training.application.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateTrainingRequestModel {
    private String title;
    private String description;
    private String provider;
    private List<Long> departmentId;
}