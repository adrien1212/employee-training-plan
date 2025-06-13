package fr.adriencaubel.trainingplan.training.infrastructure.rest;

import fr.adriencaubel.trainingplan.training.application.SessionService;
import fr.adriencaubel.trainingplan.training.application.dto.SessionResponseModel;
import fr.adriencaubel.trainingplan.training.application.dto.UpdateSessionRequestModel;
import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/v1/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @GetMapping
    public ResponseEntity<Page<SessionResponseModel>> getSessions(@RequestParam(value = "trainingId", required = false) Long trainingId, @RequestParam(value = "trainerId", required = false) Long trainerId, @RequestParam(value = "sessionStatus", required = false) SessionStatus sessionStatus, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        Page<Session> sessions = sessionService.getSessions(trainingId, trainerId, sessionStatus, startDate, endDate, pageable);

        Page<SessionResponseModel> sessionResponseModels = sessions.map(SessionResponseModel::toDto);

        return ResponseEntity.ok(sessionResponseModels);
    }

    @GetMapping("{id}")
    public ResponseEntity<SessionResponseModel> getSessionById(@PathVariable Long id) {
        Session session = sessionService.getSessionById(id);

        return ResponseEntity.ok(SessionResponseModel.toDto(session));
    }

    @PutMapping("{id}")
    public ResponseEntity<SessionResponseModel> updateSession(@PathVariable Long id, @RequestBody UpdateSessionRequestModel updateSessionRequestModel) {
        Session session = sessionService.updateSession(id, updateSessionRequestModel);
        return new ResponseEntity<>(SessionResponseModel.toDto(session), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{sessionId}/subscribe/{employeeId}")
    public ResponseEntity<SessionResponseModel> subscribeEmployee(
            @PathVariable Long sessionId,
            @PathVariable Long employeeId) {
        // Set the trainingId from the path variable to ensure consistency
        Session session = sessionService.subscribeEmployeeToSession(sessionId, employeeId);
        SessionResponseModel sessionResponseModel = SessionResponseModel.toDto(session);
        return new ResponseEntity<>(sessionResponseModel, HttpStatus.CREATED);
    }

    @DeleteMapping("/{sessionId}/subscribe/{employeeId}")
    public ResponseEntity<Void> unsubscribeEmployee(
            @PathVariable Long sessionId,
            @PathVariable Long employeeId) {
        // Set the trainingId from the path variable to ensure consistency
        sessionService.unsubscribeEmployeeToSession(sessionId, employeeId);
        return ResponseEntity.noContent().build();
    }

    // Permet au formateur avec un lien de cloturer la session -- trainerTocken
    @PostMapping("/complete/{token}")
    public ResponseEntity<Session> completeSession(
            @PathVariable String token) {
        // Set the trainingId from the path variable to ensure consistency
        Session session = sessionService.completeSession(token);
        return ResponseEntity.ok(session);
    }
}
