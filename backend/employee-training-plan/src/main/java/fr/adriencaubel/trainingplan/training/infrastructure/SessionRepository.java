package fr.adriencaubel.trainingplan.training.infrastructure;

import fr.adriencaubel.trainingplan.training.domain.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long>, JpaSpecificationExecutor<Session> {
    @Query("SELECT s FROM Session s WHERE s.startDate BETWEEN :start AND :end")
    List<Session> findAllByDate(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT s FROM Session s LEFT JOIN FETCH s.sessionEnrollments WHERE s.training.id = :trainingId AND s.startDate >= :startDate AND s.endDate <= :endDate")
    List<Session> findAllByTrainingIdWithEnrollments(@Param("trainingId") Long trainingId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
