package fr.adriencaubel.trainingplan.company.application.service;

import fr.adriencaubel.trainingplan.company.application.dto.CreateDepartementRequestModel;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import fr.adriencaubel.trainingplan.company.infrastructure.repository.CompanyRepository;
import fr.adriencaubel.trainingplan.company.infrastructure.repository.DepartmentRepository;
import fr.adriencaubel.trainingplan.company.infrastructure.repository.DepartmentSpecifications;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    private final CompanyRepository companyRepository;

    private final UserService userService;

    public boolean existsByIdAndCompany(Long id, Company company) {
        return departmentRepository.existsByIdAndCompany(id, company);
    }

    @PreAuthorize("@departmentSecurityEvaluator.hasAccess(#departmentId)")
    public Department findById(Long departmentId) {
        return departmentRepository.findById(departmentId).orElseThrow(() -> new EntityNotFoundException("Department with id " + departmentId + " not found"));
    }

    public Page<Department> findAll(Long trainingId, Pageable pageable) {
        Company company = userService.getCompanyOfAuthenticatedUser();

        Specification<Department> specification = DepartmentSpecifications.filter(company.getId(), trainingId);

        return departmentRepository.findAll(specification, pageable);
    }

    @Transactional
    public Department addDepartment(CreateDepartementRequestModel command) {
        Company company = userService.getCompanyOfAuthenticatedUser();

        Department department = new Department(command.getDepartmentName());
        company.addDepartment(department);

        companyRepository.save(company);
        return department;
    }

    public Long count() {
        Company company = userService.getCompanyOfAuthenticatedUser();
        return departmentRepository.countByCompanyAndActive(company, true);
    }
}
