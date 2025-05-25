package fr.adriencaubel.trainingplan.statistics.domain;

import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.Training;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class TrainingStatistics {
    private final Training training;

    private final LocalDate startDate;

    private final LocalDate endDate;

    // Nombre d'employé formé par cette formation sur la Période startDate endDate
    private final int employeesConducted;

    private final List<Session> sessions;

    public TrainingStatistics(Training training, List<Session> sessions, LocalDate startDate, LocalDate endDate) {
        this.training = training;
        this.startDate = startDate;
        this.endDate = endDate;
        this.sessions = sessions;
        this.employeesConducted = sessions.stream().map(s -> s.getSessionEnrollments().size()).reduce(0, Integer::sum);
    }
}
