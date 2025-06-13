package fr.adriencaubel.trainingplan.training.application.dto;

import fr.adriencaubel.trainingplan.company.application.dto.DepartmentResponseModel;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import fr.adriencaubel.trainingplan.training.domain.Training;
import fr.adriencaubel.trainingplan.training.domain.TrainingStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class TrainingResponseModel {
    private Long id;
    private String title;
    private String description;
    private String provider;
    private Integer duration;
    private List<DepartmentResponseModel> departments;
    private TrainingStatus trainingStatus;

    public TrainingResponseModel(Long id, String title, String description, String provider, Integer duration, Set<Department> departmentList,
                                 TrainingStatus trainingStatus) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.provider = provider;
        this.duration = duration;
        this.departments = departmentList.stream().map(DepartmentResponseModel::toDto).collect(Collectors.toList());
        this.trainingStatus = trainingStatus;

    }

    public static TrainingResponseModel toDto(Training training) {
        return new TrainingResponseModel(
                training.getId(),
                training.getTitle(),
                training.getDescription(),
                training.getProvider(),
                training.getDuration(),
                training.getDepartments(),
                training.getStatus()
        );
    }
}