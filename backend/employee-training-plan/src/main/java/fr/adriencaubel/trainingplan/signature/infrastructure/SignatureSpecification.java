package fr.adriencaubel.trainingplan.signature.infrastructure;

import fr.adriencaubel.trainingplan.signature.domain.Signature;
import org.springframework.data.jpa.domain.Specification;

public class SignatureSpecification {
    public static Specification<Signature> filter(Long sessionId, Long enrollmentId, Long employeeId) {
        Specification<Signature> specification = Specification.where(null);

        if (sessionId != null) {
            specification = specification.and(hasSession(sessionId));
        }

        if (enrollmentId != null) {
            specification = specification.and(hasSessionEnrollment(enrollmentId));
        }

        if (employeeId != null) {
            specification = specification.and(hasEmployee(employeeId));
        }

        return specification;
    }

    public static Specification<Signature> hasSession(Long sessionId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("sessionEnrollment").get("session").get("id"), sessionId);
    }

    public static Specification<Signature> hasSessionEnrollment(Long enrollmentId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("sessionEnrollment").get("id"), enrollmentId);
    }

    public static Specification<Signature> hasEmployee(Long employeeId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("sessionEnrollment").get("employee").get("id"), employeeId);
    }
}
