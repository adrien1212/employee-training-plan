package fr.adriencaubel.trainingplan.training.infrastructure;


import fr.adriencaubel.trainingplan.training.domain.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long>, JpaSpecificationExecutor<Feedback> {

    Optional<Feedback> findBySessionEnrollmentId(Long sessionEnrollmentId);
}
