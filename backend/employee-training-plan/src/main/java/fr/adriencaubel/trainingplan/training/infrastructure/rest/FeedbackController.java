package fr.adriencaubel.trainingplan.training.infrastructure.rest;

import fr.adriencaubel.trainingplan.training.application.FeedbackService;
import fr.adriencaubel.trainingplan.training.application.SessionService;
import fr.adriencaubel.trainingplan.training.application.dto.FeedbackRequestModel;
import fr.adriencaubel.trainingplan.training.domain.Feedback;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {
    private final SessionService sessionService;

    @GetMapping
    public ResponseEntity<List<Feedback>> getFeedbacksBySession(@RequestParam(value = "sessionId", required = true) Long sessionId) {
        List<Feedback> feedbacks = sessionService.getFeedbacksBySessionId(sessionId);
        return ResponseEntity.ok(feedbacks);
    }

    @PostMapping("{feedbackToken}")
    public ResponseEntity<?> giveFeedback(@PathVariable String feedbackToken, @RequestBody FeedbackRequestModel feedbackRequestModel) {
        sessionService.giveFeedback(feedbackToken, feedbackRequestModel);
        return ResponseEntity.ok().build();
    }
}
