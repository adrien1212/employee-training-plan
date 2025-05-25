package fr.adriencaubel.trainingplan.training.application.dto;

import fr.adriencaubel.trainingplan.employee.application.dto.EmployeeResponseModel;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SessionEnrollmentResponseModel {
    private Long id;
    private SessionResponseModel session;
    private EmployeeResponseModel employee;
    private boolean completed;

    public static SessionEnrollmentResponseModel toDto(SessionEnrollment sessionEnrollment) {
        SessionEnrollmentResponseModel sessionEnrollmentResponseModel = new SessionEnrollmentResponseModel();
        sessionEnrollmentResponseModel.setId(sessionEnrollment.getId());
        sessionEnrollmentResponseModel.setCompleted(sessionEnrollment.isCompleted());
        sessionEnrollmentResponseModel.setSession(SessionResponseModel.toDto(sessionEnrollment.getSession()));
        sessionEnrollmentResponseModel.setEmployee(EmployeeResponseModel.toDto(sessionEnrollment.getEmployee()));
        return sessionEnrollmentResponseModel;
    }
}
