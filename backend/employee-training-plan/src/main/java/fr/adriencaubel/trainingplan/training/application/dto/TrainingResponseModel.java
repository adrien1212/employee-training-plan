package fr.adriencaubel.trainingplan.training.application.dto;

import fr.adriencaubel.trainingplan.training.domain.Training;
import fr.adriencaubel.trainingplan.training.domain.TrainingStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrainingResponseModel {
    private Long id;
    private String title;
    private String description;
    private String provider;
    private TrainingStatus trainingStatus;

    public TrainingResponseModel(Long id, String title, String description, String provider,
                                 TrainingStatus trainingStatus) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.provider = provider;
        this.trainingStatus = trainingStatus;
    }

    public static TrainingResponseModel toDto(Training training) {
        return new TrainingResponseModel(
                training.getId(),
                training.getTitle(),
                training.getDescription(),
                training.getProvider(),
                training.getStatus()
        );
    }
}