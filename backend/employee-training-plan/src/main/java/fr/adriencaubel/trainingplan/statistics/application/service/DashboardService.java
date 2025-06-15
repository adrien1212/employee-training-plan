package fr.adriencaubel.trainingplan.statistics.application.service;

import fr.adriencaubel.trainingplan.company.application.service.DepartmentService;
import fr.adriencaubel.trainingplan.company.application.service.UserService;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.employee.application.service.EmployeeService;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.statistics.application.dto.GlobalStatisticData;
import fr.adriencaubel.trainingplan.statistics.application.dto.SessionStatisticsData;
import fr.adriencaubel.trainingplan.statistics.domain.EmployeeStatistics;
import fr.adriencaubel.trainingplan.statistics.domain.TrainingStatistics;
import fr.adriencaubel.trainingplan.statistics.infrastructure.BetterSessionStatisticsData;
import fr.adriencaubel.trainingplan.statistics.infrastructure.BetterTrainingStatisticData;
import fr.adriencaubel.trainingplan.training.application.SessionEnrollmentService;
import fr.adriencaubel.trainingplan.training.application.SessionService;
import fr.adriencaubel.trainingplan.training.application.TrainingService;
import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import fr.adriencaubel.trainingplan.training.domain.Training;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final SessionService sessionService;
    private final EmployeeService employeeService;
    private final SessionEnrollmentService sessionEnrollmentService;
    private final TrainingService trainingService;
    private final UserService userService;
    private final DepartmentService departmentService;

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

    public BetterSessionStatisticsData createStatisticBySession(Long sessionId) {
        Session session = sessionService.findBySessionIdWithEnrollments(sessionId);
        Set<SessionEnrollment> sessionEnrollments = session.getSessionEnrollments();

        BetterSessionStatisticsData betterSessionStatisticsData = new BetterSessionStatisticsData();
        betterSessionStatisticsData.setStatus(session.getLastStatus());
        betterSessionStatisticsData.setStartDate(session.getStartDate());
        betterSessionStatisticsData.setEndDate(session.getEndDate());
        betterSessionStatisticsData.setTotalParticipants(sessionEnrollments.size());
        betterSessionStatisticsData.setTotalFeedBackGiven((int) sessionEnrollments.stream().filter(se -> se.getFeedback() != null).count());

        double avgRating = sessionEnrollments.stream()
                .filter(se -> se.getFeedback() != null)
                .mapToInt(se -> se.getFeedback().getRating())
                .average()
                .orElse(0.0);

        betterSessionStatisticsData.setFeedbackRating(sessionEnrollments.stream()
                .filter(se -> se.getFeedback() != null)
                .mapToInt(se -> se.getFeedback().getRating()).toArray());

        betterSessionStatisticsData.setAvgFeedbackRating(avgRating);

        return betterSessionStatisticsData;
    }

    public BetterTrainingStatisticData createStatisticByTraining(Long id) {
        Training training = trainingService.getTrainingById(id);
        List<Session> sessions = sessionService.findAllByTrainingIdWithEnrollments(training.getId(), null, null);
        List<BetterSessionStatisticsData> ssd = sessions.stream().map(s -> createStatisticBySession(s.getId())).toList();

        BetterTrainingStatisticData betterTrainingStatisticData = new BetterTrainingStatisticData(training.getTitle(), ssd);
        return betterTrainingStatisticData;
    }

    public GlobalStatisticData getGlobalStatistic() {
        Company currentCompany = userService.getCompanyOfAuthenticatedUser();

        GlobalStatisticData globalStatisticData = new GlobalStatisticData();

        int trainingNumber = trainingService.getAllTraining(null, null, null, null).getNumber();
        int departmentNumber = departmentService.findAll(null).getNumber();
        int sessionsNumber = sessionService.count();
        int employeeNumber = employeeService.getAllEmployees(null, null, null, null, null, null, Pageable.unpaged()).getSize();

        globalStatisticData.setTotalDepartments(departmentNumber);
        globalStatisticData.setTotalEmployees(employeeNumber);
        globalStatisticData.setTotalTrainings(trainingNumber);
        globalStatisticData.setTotalSessions(sessionsNumber);
        return globalStatisticData;
    }
}