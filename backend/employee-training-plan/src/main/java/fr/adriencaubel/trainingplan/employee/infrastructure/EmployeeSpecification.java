package fr.adriencaubel.trainingplan.employee.infrastructure;

import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

public class EmployeeSpecification {
    public static Specification<Employee> filter(String firstName, String lastName, String email, Long companyId, Long sessionId, Boolean isSubscribeToSession, Long departmentId, Long trainingId, Boolean isActive) {
        Specification<Employee> specification = Specification.where(null);

        if (firstName != null) {
            specification = specification.and(hasFirstName(firstName));
        }

        if (lastName != null) {
            specification = specification.and(hasLastname(lastName));
        }

        if (email != null) {
            specification = specification.and(hasEmail(email));
        }

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

        if (trainingId != null) {
            specification = specification.and(isSubscribeToTrainingId(trainingId));
        }

        if (isActive != null) {
            specification = specification.and(isActive(isActive));

        }

        return specification;
    }

    public static Specification<Employee> filterOr(String firstName, String lastName, String email, Long companyId, Long sessionId, Boolean isSubscribeToSession, Long departmentId, Long trainingId, Boolean isActive) {
        Specification<Employee> specification = Specification.where(null);

        if (firstName != null) {
            specification = specification.or(hasFirstName(firstName));
        }

        if (lastName != null) {
            specification = specification.or(hasLastname(lastName));
        }

        if (email != null) {
            specification = specification.or(hasEmail(email));
        }

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

        if (trainingId != null) {
            specification = specification.and(isSubscribeToTrainingId(trainingId));
        }

        if (departmentId != null) {
            specification = specification.and(hasDepartment(departmentId));
        }

        if (isActive != null) {
            specification = specification.and(isActive(isActive));
        }

        return specification;
    }

    public static Specification<Employee> hasFirstName(String firstName) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("firstName")),
                        "%" + firstName.toLowerCase() + "%");
    }

    public static Specification<Employee> hasLastname(String lastName) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("lastName")),
                        "%" + lastName.toLowerCase() + "%");
    }

    public static Specification<Employee> hasEmail(String email) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("email"), "%" + email + "%");
    }

    public static Specification<Employee> hasCompany(Long companyId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("company").get("id"), companyId);
    }

    public static Specification<Employee> hasDepartment(Long departmentId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("department").get("id"), departmentId);
    }

    public static Specification<Employee> isSubscribeTo(Long sessionId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("sessionEnrollments").get("session").get("id"), sessionId);
    }

    public static Specification<Employee> isActive(Boolean active) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("active"), active);
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

    private static Specification<Employee> isSubscribeToTrainingId(Long trainingId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("sessionEnrollments").get("session").get("training").get("id"), trainingId);
    }
}
