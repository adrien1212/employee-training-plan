package fr.adriencaubel.trainingplan.espaceetudiant;

import fr.adriencaubel.trainingplan.employee.application.dto.PublicEmployeeResponseModel;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.application.dto.PublicSessionEnrollmentResponseModel;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import fr.adriencaubel.trainingplan.training.domain.Training;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class EspaceEtudiantResponseModel {
    private PublicEmployeeResponseModel employee;
    private List<PublicSessionEnrollmentResponseModel> sessionEnrollments;
    private List<PublicTrainingResponseModel> trainings;

    public EspaceEtudiantResponseModel(PublicEmployeeResponseModel publicEmployeeResponseModel, List<PublicSessionEnrollmentResponseModel> sessionEnrollments, List<PublicTrainingResponseModel> trainings) {
        this.employee = publicEmployeeResponseModel;
        this.sessionEnrollments = sessionEnrollments;
        this.trainings = trainings;
    }

    public static EspaceEtudiantResponseModel toDto(Employee employee, List<SessionEnrollment> sessionEnrollments, List<Training> trainings) {
        PublicEmployeeResponseModel publicEmployeeResponseModel = PublicEmployeeResponseModel.toDto(employee);

        List<PublicSessionEnrollmentResponseModel> publicSessionEnrollmentResponseModels = new ArrayList<>();
        for (SessionEnrollment sessionEnrollment : sessionEnrollments) {
            publicSessionEnrollmentResponseModels.add(PublicSessionEnrollmentResponseModel.toDto(sessionEnrollment));
        }

        return new EspaceEtudiantResponseModel(publicEmployeeResponseModel, publicSessionEnrollmentResponseModels, null);
    }
}
