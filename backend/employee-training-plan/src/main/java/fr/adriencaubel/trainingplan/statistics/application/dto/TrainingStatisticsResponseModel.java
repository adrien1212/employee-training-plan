package fr.adriencaubel.trainingplan.statistics.application.dto;

import fr.adriencaubel.trainingplan.statistics.domain.TrainingStatistics;
import fr.adriencaubel.trainingplan.training.application.dto.SessionWithSessionEnrollmentResponseModel;
import fr.adriencaubel.trainingplan.training.application.dto.TrainingResponseModel;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class TrainingStatisticsResponseModel {
    private TrainingResponseModel training;

    private LocalDate startDate;

    private LocalDate endDate;

    // Nombre d'employé formé par cette formation sur la Période startDate endDate
    private int employeesConducted;

    private List<SessionWithSessionEnrollmentResponseModel> sessions;

    public static TrainingStatisticsResponseModel toDto(TrainingStatistics trainingStatistics) {
        TrainingStatisticsResponseModel trainingStatisticsResponseModel = new TrainingStatisticsResponseModel();
        trainingStatisticsResponseModel.setStartDate(trainingStatistics.getStartDate());
        trainingStatisticsResponseModel.setEndDate(trainingStatistics.getEndDate());
        trainingStatisticsResponseModel.setEmployeesConducted(trainingStatistics.getEmployeesConducted());
        trainingStatisticsResponseModel.setTraining(TrainingResponseModel.toDto(trainingStatistics.getTraining()));
        trainingStatisticsResponseModel.setSessions(trainingStatistics.getSessions().stream().map(SessionWithSessionEnrollmentResponseModel::toDto).collect(Collectors.toList()));
        return trainingStatisticsResponseModel;
    }
}
