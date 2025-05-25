package fr.adriencaubel.trainingplan.training.application;

import fr.adriencaubel.trainingplan.company.application.service.DepartmentService;
import fr.adriencaubel.trainingplan.company.application.service.UserService;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.employee.infrastructure.EmployeeRepository;
import fr.adriencaubel.trainingplan.training.application.dto.CreateTrainingRequestModel;
import fr.adriencaubel.trainingplan.training.application.dto.DepartmentIdRequestModel;
import fr.adriencaubel.trainingplan.training.domain.Training;
import fr.adriencaubel.trainingplan.training.domain.TrainingStatus;
import fr.adriencaubel.trainingplan.training.infrastructure.TrainingRepository;
import fr.adriencaubel.trainingplan.training.infrastructure.specifciation.TrainingSpecifications;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainingService {
    private final DepartmentService departmentService;
    private final TrainingRepository trainingRepository;
    private final EmployeeRepository employeeRepository;
    private final UserService userService;

    @Transactional
    @PreAuthorize("@departmentSecurityEvaluator.canAccessDepartments(#createTrainingRequestModel.departmentId)")
    public Training createTraining(CreateTrainingRequestModel createTrainingRequestModel) {
        Set<Department> departments = createTrainingRequestModel.getDepartmentId().stream()
                .map(departmentService::findById)
                .collect(Collectors.toSet());

        Training training = new Training(createTrainingRequestModel.getTitle(), createTrainingRequestModel.getDescription(), createTrainingRequestModel.getProvider(), departments);

        return trainingRepository.save(training);
    }

    public List<Training> getEnrolledTrainingsForEmployeeId(Long employeeId, String status) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + employeeId));

        return trainingRepository.findByEmployeeAndStatus(employee, TrainingStatus.valueOf(status));
    }

    public List<Training> getNotEnrolledByEmployeeAndStatus(Long employeeId, String status) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + employeeId));

        return trainingRepository.findNotEnrolledByEmployeeAndStatus(employee.getDepartment(), employee, TrainingStatus.valueOf(status));
    }

    @PreAuthorize("@trainingSecurityEvaluator.canAccessTraining(#trainingId)")
    public Training getTrainingById(Long trainingId) {
        return trainingRepository.findByIdWithDepartments(trainingId).orElseThrow(() -> new EntityNotFoundException("Training not found with id: " + trainingId));
    }

    @PreAuthorize("@trainingSecurityEvaluator.canAccessTraining(#trainingId)")
    public Training getTrainingWithSessionEnrollment(Long trainingId) {
        return trainingRepository.findByIdWithSessionEnrollment(trainingId).orElseThrow(() -> new EntityNotFoundException("Training not found with id: " + trainingId));
    }

    public List<Training> getAllTraining(TrainingStatus status, Long departmentId, Long employeeId) {
        Company currentCompany = userService.getCompanyOfAuthenticatedUser();

        Specification<Training> specification = TrainingSpecifications.filter(currentCompany.getId(), status, departmentId, employeeId);
        return trainingRepository.findAll(specification);
    }

    // @Transactional permet d'éviter LazyInitializeException car on garde la transaction ouverte sur toute la méthode (en plus du fait detre transactionnelle)
    @Transactional
    @PreAuthorize("@trainingSecurityEvaluator.canAccessTraining(#trainingId) && @departmentSecurityEvaluator.canAccessDepartment(#departmentIdRequestModel.departmentId)")
    public Training addDepartmentToTraining(Long trainingId, DepartmentIdRequestModel departmentIdRequestModel) {
        Training training = getTrainingById(trainingId);
        Department department = departmentService.findById(departmentIdRequestModel.getDepartmentId());

        if (training.getDepartments().contains(department)) {
            throw new IllegalArgumentException("Department with id: " + departmentIdRequestModel.getDepartmentId() + " already exists");
        }

        training.addDepartment(department);
        return trainingRepository.save(training);
    }
}