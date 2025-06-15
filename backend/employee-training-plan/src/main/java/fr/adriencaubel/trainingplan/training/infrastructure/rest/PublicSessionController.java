package fr.adriencaubel.trainingplan.training.infrastructure.rest;

import fr.adriencaubel.trainingplan.training.application.SessionService;
import fr.adriencaubel.trainingplan.training.application.dto.PublicSessionResponseModel;
import fr.adriencaubel.trainingplan.training.domain.Session;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("v1/public/sessions")
@RequiredArgsConstructor
public class PublicSessionController {
    private final SessionService sessionService;

    @GetMapping("/{trainerAccessToken}")
    public ResponseEntity<PublicSessionResponseModel> getSessionById(@PathVariable String trainerAccessToken) {
        Session session = sessionService.getSessionByAccessToken(trainerAccessToken);
        return ResponseEntity.ok(PublicSessionResponseModel.toDto(session));
    }
}
