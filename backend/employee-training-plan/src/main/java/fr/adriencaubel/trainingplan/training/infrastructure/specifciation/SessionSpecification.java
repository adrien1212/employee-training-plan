package fr.adriencaubel.trainingplan.training.infrastructure.specifciation;

import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import fr.adriencaubel.trainingplan.training.domain.SessionStatusHistory;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class SessionSpecification {

    public static Specification<Session> filter(Long trainingId, Long trainerId, SessionStatus status, LocalDate startDate, LocalDate endDate) {
        Specification<Session> specification = Specification.where(null);

        if (trainingId != null) {
            specification = specification.and(hasTraining(trainingId));
        }

        if (trainerId != null) {
            specification = specification.and(hasTrainer(trainerId));
        }

        if (status != null) {
            specification = specification.and(hasStatus(status));
        }

        if (startDate != null) {
            specification = specification.and(isAfter(startDate));
        }

        if (endDate != null) {
            specification = specification.and(isBefore(endDate));
        }

        return specification;
    }

    public static Specification<Session> hasTraining(Long trainingId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("training").get("id"), trainingId);
    }

    public static Specification<Session> hasTrainer(Long trainerId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("trainer").get("id"), trainerId);
    }

    public static Specification<Session> hasStatus(SessionStatus status) {
        return (root, query, cb) -> {
            // no filter if status is null
            if (status == null) {
                return cb.conjunction();
            }

            // 1) join to the history collection
            Join<Session, SessionStatusHistory> history =
                    root.join("sessionStatusHistories", JoinType.INNER);

            // 2) subquery: for given session, find the max changedAt
            Subquery<LocalDateTime> latestSubquery = query.subquery(LocalDateTime.class);
            Root<SessionStatusHistory> histSub =
                    latestSubquery.from(SessionStatusHistory.class);

            Expression<LocalDateTime> changedAtPath = histSub.get("changedAt");
            latestSubquery.select(cb.greatest(changedAtPath));
            latestSubquery.where(cb.equal(histSub.get("session"), root));

            // 3) predicates:
            //    a) this joined row is the one with changedAt = max(changedAt)
            Predicate isLatest = cb.equal(history.get("changedAt"), latestSubquery);
            //    b) and its newStatus matches the parameter
            Predicate statusMatches = cb.equal(history.get("status"), status);

            return cb.and(isLatest, statusMatches);
        };
    }

    public static Specification<Session> isAfter(LocalDate startDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("startDate"), startDate);
    }

    public static Specification<Session> isBefore(LocalDate endDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("startDate"), endDate);
    }
}
