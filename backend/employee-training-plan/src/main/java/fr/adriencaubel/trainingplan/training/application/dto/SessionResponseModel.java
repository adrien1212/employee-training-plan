package fr.adriencaubel.trainingplan.training.application.dto;

import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class SessionResponseModel {
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private SessionStatus status = SessionStatus.NOT_STARTED;

    public static SessionResponseModel toDto(Session session) {
        SessionResponseModel sessionResponseModel = new SessionResponseModel();
        sessionResponseModel.setId(session.getId());
        sessionResponseModel.setStartDate(session.getStartDate());
        sessionResponseModel.setEndDate(session.getEndDate());
        sessionResponseModel.setStatus(session.getStatus());
        return sessionResponseModel;
    }
}
