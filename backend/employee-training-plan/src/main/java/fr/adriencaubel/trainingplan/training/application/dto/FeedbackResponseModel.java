package fr.adriencaubel.trainingplan.training.application.dto;

import fr.adriencaubel.trainingplan.training.domain.Feedback;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class FeedbackResponseModel {
    private Long id;
    private int rating;
    private String comment;
    private LocalDate submittedAt;
    private String feedbackToken;
    private SessionEnrollmentResponseModel sessionEnrollment;

    public static FeedbackResponseModel toDto(Feedback feedback) {
        FeedbackResponseModel feedbackResponseModel = new FeedbackResponseModel();
        feedbackResponseModel.setId(feedback.getId());
        feedbackResponseModel.setRating(feedback.getRating());
        feedbackResponseModel.setSubmittedAt(feedback.getCreatedAt());
        feedbackResponseModel.setComment(feedback.getComment());
        feedbackResponseModel.setFeedbackToken(feedback.getFeedbackToken());
        feedbackResponseModel.setSessionEnrollment(SessionEnrollmentResponseModel.toDto(feedback.getSessionEnrollment()));
        return feedbackResponseModel;
    }
}
