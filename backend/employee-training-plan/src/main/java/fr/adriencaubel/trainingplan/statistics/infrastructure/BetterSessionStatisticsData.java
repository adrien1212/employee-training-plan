package fr.adriencaubel.trainingplan.statistics.infrastructure;

import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BetterSessionStatisticsData {
    private SessionStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private int totalParticipants;
    private int totalFeedBackGiven;
    private int[] feedbackRating;
    private double avgFeedbackRating;
}
