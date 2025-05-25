package fr.adriencaubel.trainingplan.statistics.domain;

import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

// Value Object
@Getter
public class EmployeeStatistics {
    private final Employee employee;

    private final List<SessionEnrollment> sessionEnrollments;

    private final LocalDate startDate;

    private final LocalDate endDate;

    private final int totalSessionEnrolled;

    private final int totalTraininsDays;

    public EmployeeStatistics(Employee employee, List<SessionEnrollment> sessionEnrollments, LocalDate startDate, LocalDate endDate) {
        this.employee = employee;
        this.sessionEnrollments = sessionEnrollments;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalSessionEnrolled = sessionEnrollments.size();
        this.totalTraininsDays = sessionEnrollments.stream().map(s -> s.getSession().getSessionDuration()).reduce(0, Integer::sum);
    }
}
