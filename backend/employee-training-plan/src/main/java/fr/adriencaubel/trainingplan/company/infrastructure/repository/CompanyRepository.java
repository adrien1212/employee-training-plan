package fr.adriencaubel.trainingplan.company.infrastructure.repository;

import fr.adriencaubel.trainingplan.company.domain.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {

}
