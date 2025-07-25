package fr.adriencaubel.trainingplan.training.infrastructure;


import fr.adriencaubel.trainingplan.training.domain.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long>, JpaSpecificationExecutor<Feedback> {

    @Query("""
                SELECT f
                FROM Feedback f
                LEFT JOIN FETCH f.sessionEnrollment se
                LEFT JOIN FETCH se.session s
                WHERE s.id = :sessionId
            """)
    List<Feedback> findAllBySessionId(@Param("sessionId") Long sessionId);
}
