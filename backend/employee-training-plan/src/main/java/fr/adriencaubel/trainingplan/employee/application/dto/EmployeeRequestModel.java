package fr.adriencaubel.trainingplan.employee.application.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeRequestModel {
    private String firstName;
    private String lastName;
    private String email;
    private Long departmentId;
}
