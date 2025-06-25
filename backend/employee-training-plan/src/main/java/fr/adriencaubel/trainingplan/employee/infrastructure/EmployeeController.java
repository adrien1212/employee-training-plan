package fr.adriencaubel.trainingplan.employee.infrastructure;

import fr.adriencaubel.trainingplan.employee.application.dto.EmployeeRequestModel;
import fr.adriencaubel.trainingplan.employee.application.dto.EmployeeResponseModel;
import fr.adriencaubel.trainingplan.employee.application.service.EmployeeService;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.application.TrainingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;

    private final TrainingService trainingService;

    // On peut récupérer tous les employees inscrit à une session (isSubscribeToSession = true)
    // On peiut récupérer tous les employess pas inscrit à une session (isSubscribeToSession = false)
    @GetMapping
    public ResponseEntity<Page<EmployeeResponseModel>> getAllEmployees(
            @RequestParam(name = "firstName", required = false) String firstName,
            @RequestParam(name = "lastName", required = false) String lastName,
            @RequestParam(name = "email", required = false) String email,
            @RequestParam(name = "sessionId", required = false) Long sessionId,
            @RequestParam(name = "isSubscribeToSession", required = false) Boolean isSubscribeToSession,
            @RequestParam(name = "departmentId", required = false) Long departmentId,
            Pageable pageable
    ) {
        Page<EmployeeResponseModel> employeePage = employeeService
                .getAllEmployees(firstName, lastName, email, sessionId, isSubscribeToSession, departmentId, pageable)
                .map(EmployeeResponseModel::toDto); // Map each entity to DTO

        return ResponseEntity.ok(employeePage);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countEmployees() {
        Long employeesNumber = employeeService.count();
        return ResponseEntity.ok(employeesNumber);
    }

    @GetMapping("{id}")
    public EmployeeResponseModel getEmployee(@PathVariable Long id) {
        Employee employee = employeeService.getEmployeeById(id);
        return EmployeeResponseModel.toDto(employee);
    }

    @PostMapping
    public ResponseEntity<EmployeeResponseModel> createEmployee(@RequestBody EmployeeRequestModel createEmployeeRequestModel) {
        Employee employee = employeeService.createEmployee(createEmployeeRequestModel);
        return ResponseEntity.ok(EmployeeResponseModel.toDto(employee));
    }

    @PutMapping("{id}")
    public ResponseEntity<EmployeeResponseModel> updateEmployee(
            @PathVariable Long id,
            @RequestBody EmployeeRequestModel updateRequest
    ) {
        Employee updated = employeeService.updateEmployee(id, updateRequest);
        return ResponseEntity.ok(EmployeeResponseModel.toDto(updated));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

}
