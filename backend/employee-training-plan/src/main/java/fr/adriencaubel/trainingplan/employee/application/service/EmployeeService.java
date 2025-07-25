package fr.adriencaubel.trainingplan.employee.application.service;

import fr.adriencaubel.trainingplan.company.application.service.DepartmentService;
import fr.adriencaubel.trainingplan.company.application.service.UserService;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import fr.adriencaubel.trainingplan.employee.application.dto.EmployeeRequestModel;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.employee.infrastructure.EmployeeRepository;
import fr.adriencaubel.trainingplan.employee.infrastructure.EmployeeSpecification;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final DepartmentService departmentService;
    private final UserService userService;

    public Page<Employee> getAllEmployees(String firstName, String lastName, String email, Long sessionId, Boolean isSubscribeToSession, Long departmentId, Long trainingId, Pageable pageable) {
        Company company = userService.getCompanyOfAuthenticatedUser();

        Specification<Employee> specification = EmployeeSpecification.filter(firstName, lastName, email, company.getId(), sessionId, isSubscribeToSession, departmentId, trainingId, true);

        return employeeRepository.findAll(specification, pageable);
    }

    public Page<Employee> getAllEmployeesSearchOr(String firstName, String lastName, String email, Long sessionId, Boolean isSubscribeToSession, Long departmentId, Long trainingId, Pageable pageable) {
        Company company = userService.getCompanyOfAuthenticatedUser();

        Specification<Employee> specification = EmployeeSpecification.filterOr(firstName, lastName, email, company.getId(), sessionId, isSubscribeToSession, departmentId, trainingId, true);

        return employeeRepository.findAll(specification, pageable);
    }

    //@PreAuthorize("@employeeSecurityEvaluator.canAccessEmployee(#id)")
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));
    }

    public List<Employee> getEmployeesByTrainingId(Long trainingId, Boolean isCompleted) {
        return employeeRepository.findAllByTrainingId(trainingId, isCompleted);
    }

    public Integer countEmployees() {
        Company company = userService.getCompanyOfAuthenticatedUser();
        return employeeRepository.countByCompany(company);
    }

    @Transactional
    //@PreAuthorize("@departmentSecurityEvaluator.canAccessDepartment(#createEmployeeRequestModel.departmentId)")
    public Employee createEmployee(EmployeeRequestModel createEmployeeRequestModel) {
        Company company = userService.getCompanyOfAuthenticatedUser();

        if (countEmployees() > company.getPlan().getMaxEmployees()) {
            throw new EntityExistsException("Employees max value");
        }

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
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        employee.setActive(false);
        employeeRepository.save(employee);
    }

    public Employee getEmployeeByEmailAndCodeEmployee(String email, String codeEmployee) {
        return employeeRepository.findByEmailAndCodeEmployee(email, codeEmployee);
    }

    public Long count(Long departmentId, Long trainingId) {
        Company company = userService.getCompanyOfAuthenticatedUser();
        Specification<Employee> specification = EmployeeSpecification.filter(null, null, null, company.getId(), null, null, departmentId, trainingId, true);
        return employeeRepository.count(specification);
    }
}
