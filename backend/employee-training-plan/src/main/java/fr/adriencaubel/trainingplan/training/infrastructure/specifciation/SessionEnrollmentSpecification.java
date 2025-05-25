package fr.adriencaubel.trainingplan.training.infrastructure.specifciation;

import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class SessionEnrollmentSpecification {
    public static Specification<SessionEnrollment> filter(Long trainingId, Long employeeId, SessionStatus status, LocalDate startDate, LocalDate endDate) {
        Specification<SessionEnrollment> specification = Specification.where(null);

        if (trainingId != null) {
            specification = specification.and(hasTraining(trainingId));
        }

        if (employeeId != null) {
            specification = specification.and(hasEmployee(employeeId));
        }

        if (status != null) {
            specification = specification.and(hasStatus(status));
        }

        if (startDate != null && endDate != null) {
            specification = specification.and(hasSessionDateBetween(startDate, endDate));
        }

        return specification;
    }

    public static Specification<SessionEnrollment> hasTraining(Long trainingId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("session").get("training").get("id"), trainingId);
    }

    private static Specification<SessionEnrollment> hasEmployee(Long employeeId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("employee").get("id"), employeeId);
    }

    public static Specification<SessionEnrollment> hasStatus(SessionStatus status) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("session").get("status"), status);
    }

    public static Specification<SessionEnrollment> hasSessionDateBetween(LocalDate startDate, LocalDate endDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.between(root.get("session").get("startDate"), startDate, endDate);
    }
}
