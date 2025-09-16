package fr.adriencaubel.trainingplan.training.application.dto;

import fr.adriencaubel.trainingplan.training.domain.Training;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrainingResponseModel {
    private Long id;
    private String title;
    private String description;
    private String provider;
    private Integer duration;
    private boolean active;
    private String content;

    public TrainingResponseModel(Long id, String title, String description, String provider, Integer duration, String content) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.provider = provider;
        this.duration = duration;
        active = true;
        this.content = content;
    }

    public static TrainingResponseModel toDto(Training training) {
        return new TrainingResponseModel(
                training.getId(),
                training.getTitle(),
                training.getDescription(),
                training.getProvider(),
                training.getDuration(),
                training.getContent()
        );
    }
}