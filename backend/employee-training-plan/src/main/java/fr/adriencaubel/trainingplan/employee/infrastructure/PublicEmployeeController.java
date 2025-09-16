package fr.adriencaubel.trainingplan.employee.infrastructure;

import fr.adriencaubel.trainingplan.employee.application.dto.PublicEmployeeResponseModel;
import fr.adriencaubel.trainingplan.employee.application.service.EmployeeService;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("v1/public/employees")
@RequiredArgsConstructor
public class PublicEmployeeController {

    private final EmployeeService employeeService;

    // NO LONGER USE VOIR ESPACEETUDIANTCONTROLLER
    @Deprecated
    @GetMapping
    public ResponseEntity<PublicEmployeeResponseModel> getEmployee(@RequestParam String email, @RequestParam String codeEmployee) {
        Employee employee = employeeService.getEmployeeByEmailAndCodeEmployee(email, codeEmployee);
        return ResponseEntity.ok(PublicEmployeeResponseModel.toDto(employee));
    }
}
