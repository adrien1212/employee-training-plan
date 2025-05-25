package fr.adriencaubel.trainingplan.training.infrastructure.rest;

import fr.adriencaubel.trainingplan.training.application.SessionEnrollmentService;
import fr.adriencaubel.trainingplan.training.application.SessionService;
import fr.adriencaubel.trainingplan.training.application.dto.SessionEnrollmentResponseModel;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("v1/sessions-enrollment")
@RequiredArgsConstructor
public class SessionEnrollmentController {
    private final SessionEnrollmentService sessionEnrollmentService;

    private final SessionService sessionService;

    // Soit le trainingId ou employeeID doit être présent
    // TODO voir s'il n'est pas préférable d'avoir les salarié par session (au lieu que par training)
    @GetMapping
    public ResponseEntity<List<SessionEnrollmentResponseModel>> getAllEmployeesByTrainingId(
            @RequestParam(value = "trainingId", required = false) Long trainingId,
            @RequestParam(value = "employeeId", required = false) Long employeeId,
            @RequestParam(value = "sessionStatus", required = false) SessionStatus sessionStatus) {
        List<SessionEnrollment> sessionEnrollments = sessionEnrollmentService.findAllByTrainingIdOrEmployeeId(trainingId, employeeId, sessionStatus);

        List<SessionEnrollmentResponseModel> sessionEnrollmentResponseModel = sessionEnrollments.stream().map(SessionEnrollmentResponseModel::toDto).collect(Collectors.toList());

        return new ResponseEntity<>(sessionEnrollmentResponseModel, HttpStatus.OK);
    }
}
