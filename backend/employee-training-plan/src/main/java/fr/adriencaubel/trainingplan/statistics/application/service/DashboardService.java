package fr.adriencaubel.trainingplan.statistics.application.service;

import fr.adriencaubel.trainingplan.employee.application.service.EmployeeService;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.statistics.application.dto.SessionStatisticsData;
import fr.adriencaubel.trainingplan.statistics.domain.EmployeeStatistics;
import fr.adriencaubel.trainingplan.statistics.domain.TrainingStatistics;
import fr.adriencaubel.trainingplan.training.application.SessionEnrollmentService;
import fr.adriencaubel.trainingplan.training.application.SessionService;
import fr.adriencaubel.trainingplan.training.application.TrainingService;
import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import fr.adriencaubel.trainingplan.training.domain.Training;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final SessionService sessionService;
    private final EmployeeService employeeService;
    private final SessionEnrollmentService sessionEnrollmentService;
    private final TrainingService trainingService;

    public EmployeeStatistics statisticsByEmployeeId(Long employeeId, LocalDate startDate, LocalDate endDate) {
        Employee employee = employeeService.getEmployeeById(employeeId);
        List<SessionEnrollment> sessionEnrollments = sessionEnrollmentService.findAllByEmployeeIdAndSessionDate(employeeId, startDate, endDate);

        EmployeeStatistics employeeStat = new EmployeeStatistics(
                employee,
                sessionEnrollments,
                startDate,
                endDate
        );

        return employeeStat;
    }

    public TrainingStatistics statisticsByTrainingId(Long trainingId, LocalDate startDate, LocalDate endDate) {
        Training training = trainingService.getTrainingById(trainingId);
        List<Session> session = sessionService.findAllByTrainingIdWithEnrollments(trainingId, startDate, endDate);

        TrainingStatistics trainingStat = new TrainingStatistics(
                training,
                session,
                startDate,
                endDate
        );

        return trainingStat;
    }

    public List<SessionStatisticsData> getAllSessionsByYear(Integer year) {
        if (year == null) {
            year = Year.now().getValue();
        }

        List<SessionStatisticsData> yearData = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            List<Session> sessions = sessionService.getSessionByMonth(month, year);
            yearData.add(new SessionStatisticsData(month, sessions.size(), sessions));
        }
        return yearData;
    }

    public Double getAverageSessionByEmployee() {
        //Double d = sessionEnrollmentRepository.avgTrainingsPerEmployee();
        return 1.0;
    }
}