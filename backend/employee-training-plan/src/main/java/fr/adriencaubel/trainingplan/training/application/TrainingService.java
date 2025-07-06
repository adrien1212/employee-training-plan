package fr.adriencaubel.trainingplan.training.application;

import fr.adriencaubel.trainingplan.company.application.service.DepartmentService;
import fr.adriencaubel.trainingplan.company.application.service.UserService;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import fr.adriencaubel.trainingplan.company.domain.model.User;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.employee.infrastructure.EmployeeRepository;
import fr.adriencaubel.trainingplan.training.application.dto.CreateTrainingRequestModel;
import fr.adriencaubel.trainingplan.training.application.dto.DepartmentIdRequestModel;
import fr.adriencaubel.trainingplan.training.domain.Training;
import fr.adriencaubel.trainingplan.training.domain.TrainingDocument;
import fr.adriencaubel.trainingplan.training.domain.TrainingStatus;
import fr.adriencaubel.trainingplan.training.infrastructure.TrainingDocumentRepository;
import fr.adriencaubel.trainingplan.training.infrastructure.TrainingRepository;
import fr.adriencaubel.trainingplan.training.infrastructure.specifciation.TrainingSpecifications;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
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
    private final TrainingDocumentRepository trainingDocumentRepository;

    @Transactional
    @PreAuthorize("@departmentSecurityEvaluator.canAccessDepartments(#createTrainingRequestModel.departmentIds)")
    public Training createTraining(CreateTrainingRequestModel createTrainingRequestModel) {
        Set<Department> departments = createTrainingRequestModel.getDepartmentIds().stream()
                .map(departmentService::findById)
                .collect(Collectors.toSet());

        Company company = userService.getCompanyOfAuthenticatedUser();

        Training training = new Training(company, createTrainingRequestModel.getTitle(), createTrainingRequestModel.getDescription(), createTrainingRequestModel.getProvider(), departments, createTrainingRequestModel.getDuration());

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

    //@PreAuthorize("@trainingSecurityEvaluator.canAccessTraining(#trainingId)")
    public Training getTrainingById(Long trainingId) {
        return trainingRepository.findByIdWithDepartments(trainingId).orElseThrow(() -> new EntityNotFoundException("Training not found with id: " + trainingId));
    }

    @PreAuthorize("@trainingSecurityEvaluator.canAccessTraining(#trainingId)")
    public Training getTrainingWithSessionEnrollment(Long trainingId) {
        return trainingRepository.findByIdWithSessionEnrollment(trainingId).orElseThrow(() -> new EntityNotFoundException("Training not found with id: " + trainingId));
    }

    public Page<Training> getAllTraining(TrainingStatus status, Long departmentId, Long employeeId, Pageable pageable) {
        Company currentCompany = userService.getCompanyOfAuthenticatedUser();

        Specification<Training> specification = TrainingSpecifications.filter(currentCompany.getId(), status, departmentId, employeeId);
        return trainingRepository.findAll(specification, pageable);
    }

    // @Transactional permet d'éviter LazyInitializeException car on garde la transaction ouverte sur toute la méthode (en plus du fait detre transactionnelle)
    @Transactional
    //@PreAuthorize("@trainingSecurityEvaluator.canAccessTraining(#trainingId) && @departmentSecurityEvaluator.canAccessDepartment(#departmentIdRequestModel.departmentId)")
    public Training addDepartmentToTraining(Long trainingId, DepartmentIdRequestModel departmentIdRequestModel) {
        Training training = getTrainingById(trainingId);
        Department department = departmentService.findById(departmentIdRequestModel.getDepartmentId());

        if (training.getDepartments().contains(department)) {
            throw new IllegalArgumentException("Department with id: " + departmentIdRequestModel.getDepartmentId() + " already exists");
        }

        training.addDepartment(department);
        return trainingRepository.save(training);
    }

    public TrainingDocument uploadTrainingPdf(MultipartFile file, Long trainingId) throws IOException {
        // check if training exist
        Training training = this.getTrainingById(trainingId);

        Company currentCompany = userService.getCompanyOfAuthenticatedUser();
        User user = userService.getAuthenticatedUser();

        TrainingDocument doc = new TrainingDocument();
        doc.setTrainingId(trainingId);
        doc.setCompanyId(currentCompany.getId());
        doc.setFilename(file.getOriginalFilename());
        doc.setContentType(file.getContentType());
        doc.setSize(file.getSize());
        doc.setFileData(file.getBytes());
        doc.setUploadedAt(Instant.now());
        doc.setUploadedByUserId(user.getId());

        return trainingDocumentRepository.save(doc);
    }

    public TrainingDocument getTrainingDocumentById(Long trainingId, String trainingDocumentId) {
        TrainingDocument trainingDocument = trainingDocumentRepository.findById(trainingDocumentId).orElseThrow();

        if (trainingDocument.getTrainingId() != trainingId) {
            throw new IllegalArgumentException("Training document with id: " + trainingDocumentId + " does not belong to training with id: " + trainingId);
        }

        return trainingDocument;
    }

    public void deleteTrainingDocumentBy(Long trainingId, String trainingDocumentId) {
        TrainingDocument trainingDocument = this.getTrainingDocumentById(trainingId, trainingDocumentId);
        trainingDocumentRepository.delete(trainingDocument);
    }

    public Page<TrainingDocument> getTrainingDocuments(Long trainingId, Pageable pageable) {
        return trainingDocumentRepository.findByTrainingId(trainingId, pageable);
    }

    public Long count(TrainingStatus trainingStatus) {
        return trainingRepository.countByStatus(trainingStatus);
    }
}