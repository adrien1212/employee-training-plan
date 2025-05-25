package fr.adriencaubel.trainingplan.employee.application.service;

import fr.adriencaubel.trainingplan.company.application.service.DepartmentService;
import fr.adriencaubel.trainingplan.company.application.service.UserService;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import fr.adriencaubel.trainingplan.employee.application.dto.CreateEmployeeRequestModel;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.employee.infrastructure.EmployeeRepository;
import fr.adriencaubel.trainingplan.employee.infrastructure.EmployeeSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final DepartmentService departmentService;

    private final UserService userService;


    public List<Employee> getAllEmployees(Long sessionId, Boolean isSubscribeToSession, Long departmentId) {
        Company company = userService.getCompanyOfAuthenticatedUser();

        Specification<Employee> specification = EmployeeSpecification.filter(company.getId(), sessionId, isSubscribeToSession, departmentId);

        return employeeRepository.findAll(specification);
    }

    @Transactional
    @PreAuthorize("@departmentSecurityEvaluator.canAccessDepartment(#createEmployeeRequestModel.departmentId)")
    public Employee createEmployee(CreateEmployeeRequestModel createEmployeeRequestModel) {
        Department department = departmentService.findById(createEmployeeRequestModel.getDepartmentId());

        Employee employee = Employee.create(createEmployeeRequestModel.getFirstName(), createEmployeeRequestModel.getLastName(), createEmployeeRequestModel.getEmail(), department);
        return employeeRepository.save(employee);
    }

    @PreAuthorize("@employeeSecurityEvaluator.canAccessEmployee(#id)")
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));
    }

    public List<Employee> getEmployeesByTrainingId(Long trainingId, Boolean isCompleted) {
        return employeeRepository.findAllByTrainingId(trainingId, isCompleted);
    }

    private boolean belongsToCompany(Employee employee, Company company) {
        Department employeeDepartment = employee.getDepartment();

        if (employeeDepartment == null) {
            return false;
        }

        return employeeDepartment.getCompany().getId().equals(company.getId());
    }
}
