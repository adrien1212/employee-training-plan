package fr.adriencaubel.trainingplan.training.application.dto;

import fr.adriencaubel.trainingplan.company.application.dto.DepartmentResponseModel;
import fr.adriencaubel.trainingplan.training.domain.Training;
import fr.adriencaubel.trainingplan.training.domain.TrainingStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TrainingWithDepartmentResponseModel {
    private Long id;
    private String title;
    private String description;
    private String provider;
    private TrainingStatus trainingStatus;
    private List<DepartmentResponseModel> departments;

    public TrainingWithDepartmentResponseModel(Long id, String title, String description, String provider,
                                               TrainingStatus trainingStatus, List<DepartmentResponseModel> departments) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.provider = provider;
        this.trainingStatus = trainingStatus;
        this.departments = departments;
    }

    public static TrainingWithDepartmentResponseModel toDto(Training training) {
        return new TrainingWithDepartmentResponseModel(
                training.getId(),
                training.getTitle(),
                training.getDescription(),
                training.getProvider(),
                training.getStatus(),
                training.getDepartments().stream().map(DepartmentResponseModel::toDto).toList() // Assuming 'de' was a typo
        );
    }
}