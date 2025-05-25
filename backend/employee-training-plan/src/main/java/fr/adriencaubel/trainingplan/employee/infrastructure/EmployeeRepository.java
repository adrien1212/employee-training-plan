package fr.adriencaubel.trainingplan.employee.infrastructure;

import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {
    List<Employee> findAllByDepartmentCompany(Company company);

    @Query("""
                 SELECT DISTINCT e 
                 FROM Employee e 
                 JOIN e.sessionEnrollments sE JOIN sE.session s 
                 WHERE s.training.id = :trainingId
                 AND (:isCompleted IS NULL OR sE.completed = :isCompleted)
            """)
    List<Employee> findAllByTrainingId(@Param("trainingId") Long trainingId, @Param("isCompleted") Boolean isCompleted);

    @Query("""
            SELECT DISTINCT e
            FROM Employee e
            JOIN e.sessionEnrollments se
            JOIN se.session s
            WHERE s.training.id = :trainingId
            AND (:status IS NULL OR s.status = :status)
            """)
    List<Employee> findByTrainingIdAndSessionStatus(
            @Param("trainingId") Long trainingId,
            @Param("status") SessionStatus status
    );
}
