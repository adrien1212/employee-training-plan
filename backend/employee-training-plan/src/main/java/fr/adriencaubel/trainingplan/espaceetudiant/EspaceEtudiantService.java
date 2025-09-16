package fr.adriencaubel.trainingplan.espaceetudiant;

import fr.adriencaubel.trainingplan.employee.application.service.EmployeeService;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.application.SessionEnrollmentService;
import fr.adriencaubel.trainingplan.training.application.TrainingService;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EspaceEtudiantService {

    private final EmployeeService employeeService;

    private final EspaceEtudiantAccessLinkRepository espaceEtudiantAccessLinkRepository;

    private final SessionEnrollmentService sessionEnrollmentService;

    private final TrainingService trainingService;

    public void requestLink(EspaceEtudiantRequestLinkModel requestLinkModel) {
        Employee employee = employeeService.getEmployeeByEmail(requestLinkModel.getEmail());

        EspaceEtudiantAccessLink espaceEtudiantAccessLink = new EspaceEtudiantAccessLink(employee);

        // TODO l'envoyer par mail

        espaceEtudiantAccessLinkRepository.save(espaceEtudiantAccessLink);
    }

    public EspaceEtudiantResponseModel getEspaceEtudiant(String accessToken) {
        EspaceEtudiantAccessLink accessLink = espaceEtudiantAccessLinkRepository.findByAccessToken(accessToken).orElseThrow();

        Employee employee = accessLink.getEmployee();

        // On récupère toutes les infos necessaires qu'on mettra dans le DTO EspaceEtudiantResponseModel
        List<SessionEnrollment> sessionEnrollmentPage = sessionEnrollmentService.findAllByTrainingIdOrEmployeeId(null, employee.getId(), null, null, null, Pageable.unpaged()).toList();
        //List<Training> trainings = trainingService.getAllTraining(null, null, employee.getId(), Pageable.unpaged()).toList();

        return EspaceEtudiantResponseModel.toDto(employee, sessionEnrollmentPage, null);
    }
}
