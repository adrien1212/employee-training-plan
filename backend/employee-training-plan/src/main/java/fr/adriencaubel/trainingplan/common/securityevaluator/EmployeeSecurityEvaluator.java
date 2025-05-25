package fr.adriencaubel.trainingplan.common.securityevaluator;

import fr.adriencaubel.trainingplan.company.application.service.UserService;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.employee.infrastructure.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("employeeSecurityEvaluator")
@RequiredArgsConstructor
public class EmployeeSecurityEvaluator {
    private final UserService userService;

    private final EmployeeRepository employeeRepository;

    public boolean canAccessEmployee(Long employeeId) {
        Company company = userService.getCompanyOfAuthenticatedUser();
        Employee employee = employeeRepository.findById(employeeId).orElse(null);
        if (employee == null) return false;

        return company.getId().equals(employee.getDepartment().getCompany().getId());
    }
}