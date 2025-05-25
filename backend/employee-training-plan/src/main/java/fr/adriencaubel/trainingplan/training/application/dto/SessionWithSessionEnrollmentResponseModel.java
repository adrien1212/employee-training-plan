package fr.adriencaubel.trainingplan.training.application.dto;

import fr.adriencaubel.trainingplan.training.domain.Session;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class SessionWithSessionEnrollmentResponseModel {
    private SessionResponseModel session;
    private List<SessionEnrollmentResponseModel> sessionEnrollments;
    private int numberOfEnrollments;

    public static SessionWithSessionEnrollmentResponseModel toDto(Session session) {
        SessionWithSessionEnrollmentResponseModel sessionResponseModel = new SessionWithSessionEnrollmentResponseModel();
        sessionResponseModel.setSession(SessionResponseModel.toDto(session));
        sessionResponseModel.setNumberOfEnrollments(session.getSessionEnrollments().size());
        sessionResponseModel.setSessionEnrollments(session.getSessionEnrollments().stream().map(SessionEnrollmentResponseModel::toDto).collect(Collectors.toList()));
        return sessionResponseModel;
    }
}
