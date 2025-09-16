package fr.adriencaubel.trainingplan.employee.application.dto;

import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.application.dto.PublicSessionEnrollmentResponseModel;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PublicEmployeeResponseModel {
    Long id;
    String firstName;
    String lastName;
    String email;
    List<PublicSessionEnrollmentResponseModel> sessionEnrollments;

    public static PublicEmployeeResponseModel toDto(Employee employee) {
        PublicEmployeeResponseModel publicEmployeeResponseModel = new PublicEmployeeResponseModel();
        publicEmployeeResponseModel.setId(employee.getId());
        publicEmployeeResponseModel.setFirstName(employee.getFirstName());
        publicEmployeeResponseModel.setLastName(employee.getLastName());
        publicEmployeeResponseModel.setEmail(employee.getEmail());
        //publicEmployeeResponseModel.setSessionEnrollments(employee.getSessionEnrollments().stream().map(PublicSessionEnrollmentResponseModel::toDto).collect(Collectors.toList()));
        return publicEmployeeResponseModel;
    }
}
