package fr.adriencaubel.trainingplan.employee.infrastructure;

import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

public class EmployeeSpecification {
    public static Specification<Employee> filter(Long companyId, Long sessionId, Boolean isSubscribeToSession, Long departmentId) {
        Specification<Employee> specification = Specification.where(null);

        if (companyId != null) {
            specification = specification.and(hasCompany(companyId));
        }

        if (sessionId != null) {
            if (Boolean.TRUE.equals(isSubscribeToSession)) {
                specification = specification.and(isSubscribeTo(sessionId));
            } else if (Boolean.FALSE.equals(isSubscribeToSession)) {
                specification = specification.and(notSubscribedTo(sessionId));
            }
        }

        if (departmentId != null) {
            specification = specification.and(hasDepartment(departmentId));
        }

        return specification;
    }

    public static Specification<Employee> hasCompany(Long companyId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("department").get("company").get("id"), companyId);
    }

    public static Specification<Employee> hasDepartment(Long departmentId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("department").get("id"), departmentId);
    }

    public static Specification<Employee> isSubscribeTo(Long sessionId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("sessionEnrollments").get("session").get("id"), sessionId);
    }

    public static Specification<Employee> notSubscribedTo(Long sessionId) {
        return (root, query, criteriaBuilder) -> {
            // LEFT JOIN to sessionEnrollments
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<Employee> subRoot = subquery.from(Employee.class);
            Join<Employee, SessionEnrollment> subJoin = subRoot.join("sessionEnrollments", JoinType.LEFT);
            subquery.select(subRoot.get("id"))
                    .where(criteriaBuilder.equal(subRoot.get("id"), root.get("id")),
                            criteriaBuilder.equal(subJoin.get("session").get("id"), sessionId));
            return criteriaBuilder.not(criteriaBuilder.exists(subquery));
        };
    }

}
