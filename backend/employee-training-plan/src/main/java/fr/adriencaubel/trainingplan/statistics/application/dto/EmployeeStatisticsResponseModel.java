package fr.adriencaubel.trainingplan.statistics.application.dto;

import fr.adriencaubel.trainingplan.employee.application.dto.EmployeeResponseModel;
import fr.adriencaubel.trainingplan.statistics.domain.EmployeeStatistics;
import fr.adriencaubel.trainingplan.training.application.dto.SessionEnrollmentResponseModel;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class EmployeeStatisticsResponseModel {
    private EmployeeResponseModel employee;

    private int totalSessionEnrolled;

    private List<SessionEnrollmentResponseModel> sessionEnrollments;

    private long totalTraininsDays;

    private LocalDate startDate;

    private LocalDate endDate;

    public static EmployeeStatisticsResponseModel toDto(EmployeeStatistics employeeStatistics) {
        EmployeeStatisticsResponseModel employeeStatisticsResponseModel = new EmployeeStatisticsResponseModel();
        employeeStatisticsResponseModel.setEmployee(EmployeeResponseModel.toDto(employeeStatistics.getEmployee()));
        employeeStatisticsResponseModel.setSessionEnrollments(employeeStatistics.getSessionEnrollments().stream().map(SessionEnrollmentResponseModel::toDto).collect(Collectors.toList()));
        employeeStatisticsResponseModel.setTotalSessionEnrolled(employeeStatistics.getTotalSessionEnrolled());
        employeeStatisticsResponseModel.setTotalTraininsDays(employeeStatistics.getTotalTraininsDays());
        employeeStatisticsResponseModel.setStartDate(employeeStatistics.getStartDate());
        employeeStatisticsResponseModel.setEndDate(employeeStatistics.getEndDate());
        return employeeStatisticsResponseModel;
    }
}
