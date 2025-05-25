package fr.adriencaubel.trainingplan.training.infrastructure;

import fr.adriencaubel.trainingplan.company.domain.model.Department;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.domain.Training;
import fr.adriencaubel.trainingplan.training.domain.TrainingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TrainingRepository extends JpaRepository<Training, Long>, JpaSpecificationExecutor<Training> {
    @Query("SELECT a FROM Training a JOIN a.sessions s JOIN s.sessionEnrollments sE WHERE sE.employee = :employee AND (:status IS NULL OR a.status = :status)")
    List<Training> findByEmployeeAndStatus(@Param("employee") Employee employee, @Param("status") TrainingStatus status);

    @Query("""
                SELECT t
                FROM Training t
                JOIN t.departments d
                WHERE d = :department
                  AND (:status IS NULL OR t.status = :status)
                  AND NOT EXISTS (
                    SELECT 1
                    FROM t.sessions s
                    JOIN s.sessionEnrollments sE
                    WHERE s.training = t
                      AND sE.employee = :employee
                  )
            """)
    List<Training> findNotEnrolledByEmployeeAndStatus(@Param("department") Department department, @Param("employee") Employee employee, @Param("status") TrainingStatus status);

    @Query("""
            SELECT DISTINCT t FROM Training t
            JOIN t.departments d
            JOIN d.company c
            WHERE c.id = :companyId
            AND (:status IS NULL OR t.status = :status)
            """)
    List<Training> findAllByCompanyIdAndStatus(@Param("companyId") Long companyId, @Param("status") TrainingStatus status);

    @Query("SELECT t FROM Training t JOIN FETCH t.departments d WHERE t.id = :trainingId")
    Optional<Training> findByIdWithDepartments(@Param("trainingId") Long trainingId);

    @Query("""
            SELECT DISTINCT t FROM Training t
            JOIN t.departments d
            JOIN d.company c
            WHERE c.id = :companyId
            """)
    List<Training> findAllByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT a FROM Training a JOIN a.sessions s JOIN s.sessionEnrollments sE")
    Optional<Training> findByIdWithSessionEnrollment(Long trainingId);
}
