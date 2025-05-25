package fr.adriencaubel.trainingplan.statistics.application.dto;

import fr.adriencaubel.trainingplan.training.application.dto.SessionResponseModel;
import fr.adriencaubel.trainingplan.training.domain.Session;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SessionStatisticsData {
    private int month;
    private int totalSessions;
    private List<SessionResponseModel> sessions;

    public SessionStatisticsData(int month, int totalSessions, List<Session> sessions) {
        this.month = month;
        this.totalSessions = totalSessions;
        this.sessions = sessions.stream().map(SessionResponseModel::toDto).toList();
    }
}
