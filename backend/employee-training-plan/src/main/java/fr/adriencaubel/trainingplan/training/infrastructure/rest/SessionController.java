package fr.adriencaubel.trainingplan.training.infrastructure.rest;

import fr.adriencaubel.trainingplan.training.application.SessionService;
import fr.adriencaubel.trainingplan.training.application.dto.SessionResponseModel;
import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @GetMapping
    public ResponseEntity<List<SessionResponseModel>> getSessionsByTrainingId(@RequestParam("trainingId") Long trainingId, @RequestParam(value = "sessionStatus", required = false) SessionStatus sessionStatus) {
        List<Session> sessions = sessionService.getSessionsForTraining(trainingId, sessionStatus);

        List<SessionResponseModel> sessionResponseModels = sessions.stream().map(SessionResponseModel::toDto).toList();

        return ResponseEntity.ok(sessionResponseModels);
    }

    @PostMapping("/{sessionId}/subscribe/{employeeId}")
    public ResponseEntity<Session> subscribeEmployee(
            @PathVariable Long sessionId,
            @PathVariable Long employeeId) {
        // Set the trainingId from the path variable to ensure consistency
        Session session = sessionService.subscribeEmployeeToSession(sessionId, employeeId);
        return new ResponseEntity<>(session, HttpStatus.CREATED);
    }

    @DeleteMapping("/{sessionId}/subscribe/{employeeId}")
    public ResponseEntity<Void> unsubscribeEmployee(
            @PathVariable Long sessionId,
            @PathVariable Long employeeId) {
        // Set the trainingId from the path variable to ensure consistency
        sessionService.unsubscribeEmployeeToSession(sessionId, employeeId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{sessionId}/complete/{token}")
    public ResponseEntity<Session> completeSession(
            @PathVariable Long sessionId,
            @PathVariable String token) {
        // Set the trainingId from the path variable to ensure consistency
        Session session = sessionService.completeTraining(sessionId, token);
        return ResponseEntity.ok(session);
    }
}
