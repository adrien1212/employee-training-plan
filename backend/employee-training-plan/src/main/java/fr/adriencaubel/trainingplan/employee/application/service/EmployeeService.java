package fr.adriencaubel.trainingplan.employee.application.service;

import fr.adriencaubel.trainingplan.company.application.service.DepartmentService;
import fr.adriencaubel.trainingplan.company.application.service.UserService;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import fr.adriencaubel.trainingplan.employee.application.dto.EmployeeRequestModel;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.employee.infrastructure.EmployeeRepository;
import fr.adriencaubel.trainingplan.employee.infrastructure.EmployeeSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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


    public Page<Employee> getAllEmployees(String firstName, String lastName, String email, Long sessionId, Boolean isSubscribeToSession, Long departmentId, Pageable pageable) {
        Company company = userService.getCompanyOfAuthenticatedUser();

        Specification<Employee> specification = EmployeeSpecification.filter(firstName, lastName, email, company.getId(), sessionId, isSubscribeToSession, departmentId, true);

        return employeeRepository.findAll(specification, pageable);
    }

    @Transactional
    //@PreAuthorize("@departmentSecurityEvaluator.canAccessDepartment(#createEmployeeRequestModel.departmentId)")
    public Employee createEmployee(EmployeeRequestModel createEmployeeRequestModel) {
        Department department = departmentService.findById(createEmployeeRequestModel.getDepartmentId());

        Employee employee = Employee.create(createEmployeeRequestModel.getFirstName(), createEmployeeRequestModel.getLastName(), createEmployeeRequestModel.getEmail(), department);
        return employeeRepository.save(employee);
    }

    @Transactional
    public Employee updateEmployee(Long id, EmployeeRequestModel updateModel) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id " + id));

        // Update only the fields you want to allow:
        if (updateModel.getFirstName() != null) {
            existing.setFirstName(updateModel.getFirstName());
        }
        if (updateModel.getLastName() != null) {
            existing.setLastName(updateModel.getLastName());
        }
        if (updateModel.getEmail() != null) {
            existing.setEmail(updateModel.getEmail());
        }
        if (updateModel.getDepartmentId() != null) {
            Department department = departmentService.findById(updateModel.getDepartmentId());
            existing.setDepartment(department);
        }

        return employeeRepository.save(existing);
    }

    //@PreAuthorize("@employeeSecurityEvaluator.canAccessEmployee(#id)")
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

    @PreAuthorize("@employeeSecurityEvaluator.canAccessEmployee(#id)")
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        employee.setActive(false);
        employeeRepository.save(employee);
    }

    public Employee getEmployeeByEmailAndCodeEmployee(String email, String codeEmployee) {
        Employee employee = employeeRepository.findByEmailAndCodeEmployee(email, codeEmployee);
        return employee;
    }
}
