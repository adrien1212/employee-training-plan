package fr.adriencaubel.trainingplan.training.application.dto;

import fr.adriencaubel.trainingplan.employee.application.dto.EmployeeResponseModel;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SessionEnrollmentResponseModel {
    private Long id;
    private SessionResponseModel session;
    private EmployeeResponseModel employee;
    private String feedbackToken;
    private boolean hasFeedback;
    private FeedbackMini feedback;
    private boolean hasSigned;
    private String sessionEnrollmentToken;

    public static SessionEnrollmentResponseModel toDto(SessionEnrollment sessionEnrollment) {
        SessionEnrollmentResponseModel sessionEnrollmentResponseModel = new SessionEnrollmentResponseModel();
        sessionEnrollmentResponseModel.setId(sessionEnrollment.getId());
        sessionEnrollmentResponseModel.setHasFeedback(sessionEnrollment.getFeedback() != null && sessionEnrollment.getFeedback().getRating() != 0);
        sessionEnrollmentResponseModel.setSession(SessionResponseModel.toDto(sessionEnrollment.getSession()));

        if (sessionEnrollment.getFeedback() != null) {
            sessionEnrollmentResponseModel.setFeedbackToken(sessionEnrollment.getFeedback().getFeedbackToken());
        }

        sessionEnrollmentResponseModel.setEmployee(EmployeeResponseModel.toDto(sessionEnrollment.getEmployee()));
        //sessionEnrollmentResponseModel.setHasSigned(sessionEnrollment.getSignature().getSignature() != null);
        sessionEnrollmentResponseModel.setSessionEnrollmentToken(sessionEnrollment.getAccessToken());
        if (sessionEnrollment.getFeedback() != null) {
            sessionEnrollmentResponseModel.setFeedback(new FeedbackMini(sessionEnrollment.getFeedback().getId(), sessionEnrollment.getFeedback().getComment(), sessionEnrollment.getFeedback().getRating()));
        }
        return sessionEnrollmentResponseModel;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    private static class FeedbackMini {
        private Long id;
        private String comment;
        private Integer rating;
    }
}
