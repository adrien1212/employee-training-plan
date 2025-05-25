package fr.adriencaubel.trainingplan.training.infrastructure.rest;

import fr.adriencaubel.trainingplan.employee.application.service.EmployeeService;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.application.SessionService;
import fr.adriencaubel.trainingplan.training.application.TrainingService;
import fr.adriencaubel.trainingplan.training.application.dto.*;
import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.Training;
import fr.adriencaubel.trainingplan.training.domain.TrainingStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/trainings")
@RequiredArgsConstructor
public class TrainingController {

    private final TrainingService trainingService;

    private final SessionService sessionService;

    private final EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<Training> createTraining(@RequestBody CreateTrainingRequestModel createTrainingRequestModel) {
        Training training = trainingService.createTraining(createTrainingRequestModel);
        return new ResponseEntity<>(training, HttpStatus.CREATED);
    }

    @PostMapping("{trainingId}/departments")
    public ResponseEntity<TrainingResponseModel> addDepartmentToTraining(@PathVariable Long trainingId, @RequestBody DepartmentIdRequestModel departmentIdRequestModel) {
        Training training = trainingService.addDepartmentToTraining(trainingId, departmentIdRequestModel);
        return ResponseEntity.ok(TrainingResponseModel.toDto(training));
    }

    @GetMapping
    public ResponseEntity<List<TrainingResponseModel>> getAllTrainings(@RequestParam(required = false) TrainingStatus status, @RequestParam(required = false) Long departmentId, @RequestParam(required = false) Long employeeId) {
        List<Training> trainings = trainingService.getAllTraining(status, departmentId, employeeId);
        return ResponseEntity.ok(trainings.stream().map(TrainingResponseModel::toDto).toList());
    }

    @GetMapping("{id}")
    public ResponseEntity<TrainingWithDepartmentResponseModel> getById(@PathVariable Long id) {
        Training training = trainingService.getTrainingById(id);
        return ResponseEntity.ok(TrainingWithDepartmentResponseModel.toDto(training));
    }

    @GetMapping("{id}/employees")
    public ResponseEntity<List<Employee>> getAllEmployees(@PathVariable Long id, @RequestParam(value = "completed", required = false) Boolean isCompleted) {
        List<Employee> employees = employeeService.getEmployeesByTrainingId(id, isCompleted);
        return ResponseEntity.ok(employees);
    }

    @PostMapping("{id}/sessions")
    public ResponseEntity<Session> createSession(@PathVariable Long id, @RequestBody CreateSessionRequestModel createSessionRequestModel) {
        Session session = sessionService.createSession(createSessionRequestModel, id);
        return new ResponseEntity<>(session, HttpStatus.CREATED);
    }
}
