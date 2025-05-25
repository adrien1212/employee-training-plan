package fr.adriencaubel.trainingplan.training.infrastructure.specifciation;

import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class SessionSpecification {

    public static Specification<Session> filter(Long trainingId, SessionStatus status, LocalDate startDate, LocalDate endDate) {
        Specification<Session> specification = Specification.where(null);

        if (trainingId != null) {
            specification = specification.and(hasTraining(trainingId));
        }

        if (status != null) {
            specification = specification.and(hasStatus(status));
        }

        if (startDate != null && endDate != null) {
            specification = specification.and(hasSessionDateBetween(startDate, endDate));
        }

        return specification;
    }

    public static Specification<Session> hasTraining(Long trainingId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("training").get("id"), trainingId);
    }

    public static Specification<Session> hasStatus(SessionStatus status) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), status);
    }

    public static Specification<Session> hasSessionDateBetween(LocalDate startDate, LocalDate endDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.between(root.get("startDate"), startDate, endDate);
    }
}
