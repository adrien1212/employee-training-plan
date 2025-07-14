package fr.adriencaubel.trainingplan.training.infrastructure;

import fr.adriencaubel.trainingplan.training.domain.Training;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TrainingRepository extends JpaRepository<Training, Long>, JpaSpecificationExecutor<Training> {
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

    Long countByActive(boolean active);
}
