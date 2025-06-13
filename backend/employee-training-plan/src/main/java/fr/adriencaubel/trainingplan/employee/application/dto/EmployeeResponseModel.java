package fr.adriencaubel.trainingplan.employee.application.dto;

import fr.adriencaubel.trainingplan.company.application.dto.DepartmentResponseModel;
import fr.adriencaubel.trainingplan.employee.domain.Employee;

public record EmployeeResponseModel(Long id, String firstName, String lastName, String email, String codeEmployee,
                                    DepartmentResponseModel department) {

    public static EmployeeResponseModel toDto(Employee employee) {
        return new EmployeeResponseModel(employee.getId(), employee.getFirstName(), employee.getLastName(), employee.getEmail(), employee.getCodeEmployee(), DepartmentResponseModel.toDto(employee.getDepartment()));
    }
}
