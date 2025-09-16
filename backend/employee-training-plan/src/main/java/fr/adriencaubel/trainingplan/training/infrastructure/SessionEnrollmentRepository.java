package fr.adriencaubel.trainingplan.training.infrastructure;

import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;


public interface SessionEnrollmentRepository extends JpaRepository<SessionEnrollment, Long>, JpaSpecificationExecutor<SessionEnrollment> {
    List<SessionEnrollment> findBySession(Session session);

    List<SessionEnrollment> findBySessionId(Long sessionId);

    Integer countBySessionId(Long sessionId);

    //@Query("SELECT sE FROM SessionEnrollment sE JOIN Session s where s.training.id = :trainingId and (:sessionStatus is NULL OR s.status = :sessionStatus)")
    //List<SessionEnrollment> findByTrainingIdAndSessionStatus(@Param("trainingId") Long trainingId, @Param("sessionStatus") SessionStatus sessionStatus);

    @Query("SELECT sE FROM SessionEnrollment sE WHERE sE.accessToken = :accessToken")
    Optional<SessionEnrollment> findByFeedbackToken(String accessToken);

    boolean existsByEmployeeAndSession(Employee employee, Session session);

    Optional<SessionEnrollment> findByAccessToken(String accessToken);

    Page<SessionEnrollment> findBySession(Session session, Pageable pageable);
}
