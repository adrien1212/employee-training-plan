package fr.adriencaubel.trainingplan.training.infrastructure;

import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long>, JpaSpecificationExecutor<Session> {
    @Query("SELECT s FROM Session s WHERE s.startDate BETWEEN :start AND :end")
    List<Session> findAllByDate(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT s FROM Session s LEFT JOIN FETCH s.sessionEnrollments WHERE s.training.id = :trainingId AND (:startDate IS NULL OR  s.startDate >= :startDate) AND (:endDate IS NULL OR s.endDate <= :endDate)")
    List<Session> findAllByTrainingIdWithEnrollments(@Param("trainingId") Long trainingId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT s FROM Session s LEFT JOIN FETCH s.sessionEnrollments WHERE s.id = :sessionId")
    Optional<Session> findByIdWithSessionEnrollment(Long sessionId);

    @Query("SELECT s FROM Session s LEFT JOIN FETCH s.sessionEnrollments WHERE s.employeeAccessToken = :accessToken")
    Optional<Session> findByEmployeeAccessTokenWithSessionEnrollment(String accessToken);

    @Query("SELECT COUNT(s) FROM Session s WHERE s.training.company = :company")
    int countByCompany(Company company);

    @Query("SELECT s FROM Session s LEFT JOIN FETCH s.sessionEnrollments LEFT JOIN FETCH s.slotSignatures WHERE s.trainerAccessToken = :accessToken")
    Optional<Session> findByTrainerAccessTokenWithSessionEnrollmentAndSlotSignatures(String accessToken);

    Optional<Session> findByTrainerAccessToken(@NotNull String trainerAccessToken);


    @Query("""
            SELECT COUNT(s)
              FROM Session s
              JOIN SessionStatusHistory h
                ON h.session = s
             WHERE h.changedAt = (
                     SELECT MAX(h2.changedAt)
                       FROM SessionStatusHistory h2
                      WHERE h2.session = s
                   )
               AND (:sessionStatus IS NULL OR h.status = :sessionStatus)
            """)
    Long countByStatus(SessionStatus sessionStatus);
}
