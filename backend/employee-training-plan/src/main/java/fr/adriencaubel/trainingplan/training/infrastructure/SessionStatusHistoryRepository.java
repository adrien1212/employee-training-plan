package fr.adriencaubel.trainingplan.training.infrastructure;

import fr.adriencaubel.trainingplan.training.domain.SessionStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionStatusHistoryRepository extends JpaRepository<SessionStatusHistory, Long> {
}
