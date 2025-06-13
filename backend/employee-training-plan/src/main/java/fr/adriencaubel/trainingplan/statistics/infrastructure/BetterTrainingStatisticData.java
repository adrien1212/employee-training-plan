package fr.adriencaubel.trainingplan.statistics.infrastructure;

import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BetterTrainingStatisticData {
    private String trainingTitle;
    private int totalSessions;
    private int totalCompletedSessions;
    private List<BetterSessionStatisticsData> sessionsStatistics;
    private int totalEmployeesTrained;
    private int totalFeedbackGiven;
    private double avgFeedbackRating;

    public BetterTrainingStatisticData(String trainingTitle, List<BetterSessionStatisticsData> sessionsStatistics) {
        this.trainingTitle = trainingTitle;
        this.sessionsStatistics = sessionsStatistics;

        this.totalSessions = sessionsStatistics.size();
        this.totalCompletedSessions = (int) sessionsStatistics.stream().filter(ssd -> ssd.getStatus() == SessionStatus.COMPLETED).count();
        this.totalEmployeesTrained = sessionsStatistics.stream().filter(ssd -> ssd.getStatus() == SessionStatus.COMPLETED).map(BetterSessionStatisticsData::getTotalParticipants).reduce(0, Integer::sum);
        this.totalFeedbackGiven = sessionsStatistics.stream().filter(ssd -> ssd.getStatus() == SessionStatus.COMPLETED).map(BetterSessionStatisticsData::getTotalFeedBackGiven).reduce(0, Integer::sum);
        this.avgFeedbackRating = sessionsStatistics.stream().filter(ssd -> ssd.getStatus() == SessionStatus.COMPLETED && ssd.getAvgFeedbackRating() != 0).mapToDouble(BetterSessionStatisticsData::getAvgFeedbackRating).average().orElse(0);
    }
}
