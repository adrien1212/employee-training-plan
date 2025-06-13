package fr.adriencaubel.trainingplan.training.infrastructure.rest;

import fr.adriencaubel.trainingplan.training.application.FeedbackService;
import fr.adriencaubel.trainingplan.training.application.SessionEnrollmentService;
import fr.adriencaubel.trainingplan.training.application.dto.FeedbackRequestModel;
import fr.adriencaubel.trainingplan.training.application.dto.FeedbackResponseModel;
import fr.adriencaubel.trainingplan.training.application.dto.TokenValidationResponse;
import fr.adriencaubel.trainingplan.training.domain.Feedback;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService feedbackService;

    private final SessionEnrollmentService sessionEnrollmentService;

    @GetMapping
    public ResponseEntity<Page<FeedbackResponseModel>> getFeedbacks(@RequestParam(value = "trainingId", required = false) Long trainingId, @RequestParam(value = "sessionId", required = false) Long sessionId, Pageable pageable) {
        Page<Feedback> feedbacks = feedbackService.getFeedbacksBy(trainingId, sessionId, pageable);

        Page<FeedbackResponseModel> feedbackResponseModels = feedbacks.map(FeedbackResponseModel::toDto);

        return ResponseEntity.ok(feedbackResponseModels);
    }

    @PostMapping("{feedbackToken}")
    public ResponseEntity<?> giveFeedback(@PathVariable String feedbackToken, @RequestBody FeedbackRequestModel feedbackRequestModel) {
        feedbackService.giveFeedback(feedbackToken, feedbackRequestModel);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/validate")
    public ResponseEntity<TokenValidationResponse> validateToken(
            @RequestParam("token") String token) {
        SessionEnrollment sessionEnrollment = sessionEnrollmentService.validateToken(token);
        // If no exception thrown, token is valid:
        TokenValidationResponse body = new TokenValidationResponse(true, sessionEnrollment.getSession().getId(), sessionEnrollment.getEmployee().getId());
        return ResponseEntity.ok(body);
    }
}
