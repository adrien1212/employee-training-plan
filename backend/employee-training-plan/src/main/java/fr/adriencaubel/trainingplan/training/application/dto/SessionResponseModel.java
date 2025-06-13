package fr.adriencaubel.trainingplan.training.application.dto;

import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class SessionResponseModel {
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private SessionStatus status = SessionStatus.NOT_STARTED;
    private String accessToken;
    private TrainingMini training;
    private List<SessionStatusHistoryResponseModel> sessionStatusHistory;
    private Long trainerId;

    public static SessionResponseModel toDto(Session session) {
        SessionResponseModel sessionResponseModel = new SessionResponseModel();
        sessionResponseModel.setId(session.getId());
        sessionResponseModel.setStartDate(session.getStartDate());
        sessionResponseModel.setEndDate(session.getEndDate());
        sessionResponseModel.setLocation(session.getLocation());
        sessionResponseModel.setStatus(session.getLastStatus());
        sessionResponseModel.setAccessToken(session.getEmployeeAccessToken());
        sessionResponseModel.setTraining(new TrainingMini(session.getTraining().getId(), session.getTraining().getTitle()));
        sessionResponseModel.setTrainerId(session.getTrainer().getId());
        sessionResponseModel.setSessionStatusHistory(session.getSessionStatusHistories().stream().map(SessionStatusHistoryResponseModel::toDto).collect(Collectors.toList()));
        return sessionResponseModel;
    }

    @AllArgsConstructor
    @Getter
    @Setter
    private static class TrainingMini {
        private Long id;
        private String title;
    }
}
