package fr.adriencaubel.trainingplan.company.application.service;

import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import fr.adriencaubel.trainingplan.company.infrastructure.repository.DepartmentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    private final UserService userService;

    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public boolean existsByIdAndCompany(Long id, Company company) {
        return departmentRepository.existsByIdAndCompany(id, company);
    }

    public Department findById(Long departmentId) {
        return departmentRepository.findById(departmentId).orElseThrow(() -> new EntityNotFoundException("Department with id " + departmentId + " not found"));
    }

    public Page<Department> findAll(Pageable pageable) {
        Company company = userService.getCompanyOfAuthenticatedUser();
        return departmentRepository.findAllByCompany(company, pageable);
    }
}
