package fr.adriencaubel.trainingplan.training.infrastructure.specifciation;

import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import fr.adriencaubel.trainingplan.training.domain.SessionStatusHistory;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class SessionEnrollmentSpecification {
    public static Specification<SessionEnrollment> filter(Long trainingId, Long employeeId, Long sessionId, SessionStatus status, Boolean completed, LocalDate startDate, LocalDate endDate) {
        Specification<SessionEnrollment> specification = Specification.where(null);

        if (trainingId != null) {
            specification = specification.and(hasTraining(trainingId));
        }

        if (employeeId != null) {
            specification = specification.and(hasEmployee(employeeId));
        }

        if (sessionId != null) {
            specification = specification.and(hasSession(sessionId));
        }

        if (completed != null) {
            specification = specification.and(isCompleted(completed));
        }

        if (status != null) {
            specification = specification.and(hasStatus(status));
        }

        if (startDate != null && endDate != null) {
            specification = specification.and(hasSessionDateBetween(startDate, endDate));
        }

        return specification;
    }

    private static Specification<SessionEnrollment> isCompleted(Boolean completed) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("completed"), completed);
    }

    public static Specification<SessionEnrollment> hasTraining(Long trainingId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("session").get("training").get("id"), trainingId);
    }

    private static Specification<SessionEnrollment> hasEmployee(Long employeeId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("employee").get("id"), employeeId);
    }

    public static Specification<SessionEnrollment> hasSession(Long sessionId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("session").get("id"), sessionId);
    }

    public static Specification<SessionEnrollment> hasStatus(SessionStatus status) {
        return (root, query, cb) -> {
            // 1) null-safe: if no status filter, match everything
            if (status == null) {
                return cb.conjunction();
            }

            // 2) join from Enrollment → Session → History
            Join<SessionEnrollment, Session> sessionJoin =
                    root.join("session", JoinType.INNER);
            Join<Session, SessionStatusHistory> historyJoin =
                    sessionJoin.join("sessionStatusHistories", JoinType.INNER);

            // 3) subquery to find the MAX(changedAt) for this session
            Subquery<LocalDateTime> latestChangedAt = query.subquery(LocalDateTime.class);
            Root<SessionStatusHistory> histSub =
                    latestChangedAt.from(SessionStatusHistory.class);
            // typed path for changedAt so cb.greatest() compiles
            Expression<LocalDateTime> changedAtPath = histSub.get("changedAt");
            latestChangedAt.select(cb.greatest(changedAtPath));
            latestChangedAt.where(cb.equal(histSub.get("session"), sessionJoin));

            // 4) predicates: only the “latest” history row…
            Predicate isLatest = cb.equal(historyJoin.get("changedAt"), latestChangedAt);
            // …and its newStatus equals the desired status
            Predicate statusMatches = cb.equal(historyJoin.get("status"), status);

            return cb.and(isLatest, statusMatches);
        };
    }


    public static Specification<SessionEnrollment> hasSessionDateBetween(LocalDate startDate, LocalDate endDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.between(root.get("session").get("startDate"), startDate, endDate);
    }
}
