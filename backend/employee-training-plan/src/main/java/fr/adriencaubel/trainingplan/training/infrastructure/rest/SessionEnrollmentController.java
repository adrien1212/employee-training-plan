package fr.adriencaubel.trainingplan.training.infrastructure.rest;

import fr.adriencaubel.trainingplan.training.application.SessionEnrollmentService;
import fr.adriencaubel.trainingplan.training.application.SessionService;
import fr.adriencaubel.trainingplan.training.application.dto.SessionEnrollmentResponseModel;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/sessions-enrollment")
@RequiredArgsConstructor
public class SessionEnrollmentController {
    private final SessionEnrollmentService sessionEnrollmentService;

    private final SessionService sessionService;

    // Soit le trainingId ou employeeID doit être présent
    @GetMapping
    public ResponseEntity<Page<SessionEnrollmentResponseModel>> getAll(
            @RequestParam(value = "trainingId", required = false) Long trainingId,
            @RequestParam(value = "employeeId", required = false) Long employeeId,
            @RequestParam(value = "sessionId", required = false) Long sessionId,
            @RequestParam(value = "sessionStatus", required = false) SessionStatus sessionStatus,
            @RequestParam(value = "isFeedbackGiven", required = false) Boolean isFeedbackGiven,
            Pageable pageable) {
        Page<SessionEnrollment> sessionEnrollments = sessionEnrollmentService.findAllByTrainingIdOrEmployeeId(trainingId, employeeId, sessionId, sessionStatus, isFeedbackGiven, pageable);

        if (!sessionEnrollments.hasContent()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        Page<SessionEnrollmentResponseModel> sessionEnrollmentResponseModel = sessionEnrollments.map(SessionEnrollmentResponseModel::toDto);

        return new ResponseEntity<>(sessionEnrollmentResponseModel, HttpStatus.OK);
    }

    @GetMapping("{id}")
    public ResponseEntity<SessionEnrollmentResponseModel> getById(@PathVariable Long id) {
        SessionEnrollment sessionEnrollment = sessionEnrollmentService.findById(id);
        return new ResponseEntity<>(SessionEnrollmentResponseModel.toDto(sessionEnrollment), HttpStatus.OK);
    }
}
