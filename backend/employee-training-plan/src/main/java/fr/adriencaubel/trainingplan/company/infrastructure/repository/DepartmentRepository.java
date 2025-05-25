package fr.adriencaubel.trainingplan.company.infrastructure.repository;

import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    boolean existsByIdAndCompany(Long departementId, Company company);

    List<Department> findAllByCompany(Company company);
}
