package fr.adriencaubel.trainingplan.statistics.infrastructure;

import fr.adriencaubel.trainingplan.statistics.application.dto.EmployeeStatisticsResponseModel;
import fr.adriencaubel.trainingplan.statistics.application.dto.SessionStatisticsData;
import fr.adriencaubel.trainingplan.statistics.application.dto.TrainingStatisticsResponseModel;
import fr.adriencaubel.trainingplan.statistics.application.service.DashboardService;
import fr.adriencaubel.trainingplan.statistics.domain.EmployeeStatistics;
import fr.adriencaubel.trainingplan.statistics.domain.TrainingStatistics;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("v1/statistics")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("sessions")
    public ResponseEntity<List<SessionStatisticsData>> getTrainingByYear(@RequestParam(value = "year", required = false) Integer year) {
        List<SessionStatisticsData> sessionDashboardData = dashboardService.getAllSessionsByYear(year);
        return ResponseEntity.ok(sessionDashboardData);
    }

    @GetMapping("avg-sessions-per-employee")
    public ResponseEntity<Double> avgSessionsPerEmployee() {
        Double avg = dashboardService.getAverageSessionByEmployee();
        return ResponseEntity.ok(avg);
    }

    /**
     * Get all Employee statictic between two date
     *
     * @param employeeId
     * @param startDate
     * @param endDate
     * @return
     */
    @GetMapping("employees/{employeeId}")
    public ResponseEntity<EmployeeStatisticsResponseModel> statisticsByEmployeeId(@PathVariable(value = "employeeId") Long employeeId, @RequestParam("startDate") LocalDate startDate, @RequestParam("endDate") LocalDate endDate) {
        EmployeeStatistics employeeStatistics = dashboardService.statisticsByEmployeeId(employeeId, startDate, endDate);
        return ResponseEntity.ok(EmployeeStatisticsResponseModel.toDto(employeeStatistics));
    }

    @GetMapping("trainings/{trainingId}")
    public ResponseEntity<TrainingStatisticsResponseModel> statisticsByTrainingId(@PathVariable(value = "trainingId") Long trainingId, @RequestParam("startDate") LocalDate startDate, @RequestParam("endDate") LocalDate endDate) {
        TrainingStatistics trainingStatistics = dashboardService.statisticsByTrainingId(trainingId, startDate, endDate);
        return ResponseEntity.ok(TrainingStatisticsResponseModel.toDto(trainingStatistics));
    }
}
