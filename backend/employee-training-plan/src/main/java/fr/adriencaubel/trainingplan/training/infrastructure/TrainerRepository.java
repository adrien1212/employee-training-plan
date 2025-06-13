package fr.adriencaubel.trainingplan.training.infrastructure;

import fr.adriencaubel.trainingplan.training.domain.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
}
