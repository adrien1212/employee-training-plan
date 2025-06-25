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
                  JOIN e.sessionEnrollments sE
                  JOIN sE.session s
            """)
    List<Employee> findAllByTrainingId(@Param("trainingId") Long trainingId, @Param("isCompleted") Boolean isCompleted);

    @Query("""
            SELECT DISTINCT e
            FROM   Employee e
            JOIN   e.sessionEnrollments se
            JOIN   se.session s
            JOIN   s.sessionStatusHistories h
            WHERE  s.training.id = :trainingId
              AND  h.changedAt = (
                   SELECT MAX(h2.changedAt)
                   FROM   SessionStatusHistory h2
                   WHERE  h2.session = s
              )
              AND ( :status IS NULL OR h.status = :status )
            """)
    List<Employee> findByTrainingIdAndSessionStatus(
            @Param("trainingId") Long trainingId,
            @Param("status") SessionStatus status
    );

    @Query("""
                 SELECT e
                 FROM Employee e 
                 LEFT JOIN FETCH e.sessionEnrollments sE
                 WHERE e.email = :email AND e.codeEmployee = :codeEmployee
            """)
    Employee findByEmailAndCodeEmployee(String email, String codeEmployee);

    Long countByActive(boolean isActive);
}
