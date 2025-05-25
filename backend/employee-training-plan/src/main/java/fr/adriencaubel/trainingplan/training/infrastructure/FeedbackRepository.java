package fr.adriencaubel.trainingplan.training.infrastructure;


import fr.adriencaubel.trainingplan.training.domain.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
}
