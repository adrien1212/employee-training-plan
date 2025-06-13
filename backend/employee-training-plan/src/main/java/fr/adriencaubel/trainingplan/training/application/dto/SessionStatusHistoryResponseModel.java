package fr.adriencaubel.trainingplan.training.application.dto;

import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import fr.adriencaubel.trainingplan.training.domain.SessionStatusHistory;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SessionStatusHistoryResponseModel {
    private Long id;
    private SessionStatus status;
    private LocalDateTime changedAt;
    private String updateBy;

    public static SessionStatusHistoryResponseModel toDto(SessionStatusHistory sessionStatusHistory) {
        SessionStatusHistoryResponseModel sessionStatusHistoryResponseModel = new SessionStatusHistoryResponseModel();
        sessionStatusHistoryResponseModel.setId(sessionStatusHistory.getId());
        sessionStatusHistoryResponseModel.setStatus(sessionStatusHistory.getStatus());
        sessionStatusHistoryResponseModel.setChangedAt(sessionStatusHistory.getChangedAt());
        sessionStatusHistoryResponseModel.setUpdateBy(sessionStatusHistory.getUpdateBy());
        return sessionStatusHistoryResponseModel;
    }
}
