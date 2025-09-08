package fr.adriencaubel.trainingplan.training.infrastructure;

import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.training.domain.Trainer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    Page<Trainer> findAllByCompany(Company company, Pageable attr1);

    Optional<Trainer> findByIdAndCompany(Long trainerId, Company company);
}
