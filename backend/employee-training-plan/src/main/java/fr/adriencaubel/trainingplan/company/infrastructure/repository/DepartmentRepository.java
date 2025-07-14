package fr.adriencaubel.trainingplan.company.infrastructure.repository;

import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DepartmentRepository extends JpaRepository<Department, Long>, JpaSpecificationExecutor<Department> {
    boolean existsByIdAndCompany(Long departmentId, Company company);

    Long countByCompanyAndActive(Company company, boolean isActive);
}
