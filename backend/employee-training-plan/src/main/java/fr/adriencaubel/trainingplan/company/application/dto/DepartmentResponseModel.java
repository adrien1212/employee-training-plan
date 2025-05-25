package fr.adriencaubel.trainingplan.company.application.dto;

import fr.adriencaubel.trainingplan.company.domain.model.Department;

public record DepartmentResponseModel(Long id, String name) {
    public static DepartmentResponseModel toDto(Department department) {
        return new DepartmentResponseModel(department.getId(), department.getName());
    }
}
