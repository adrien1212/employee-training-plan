package fr.adriencaubel.trainingplan.statistics.application.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GlobalStatisticData {
    private int totalTrainings;
    private int totalEmployees;
    private int totalSessions;
    private int totalDepartments;
}
