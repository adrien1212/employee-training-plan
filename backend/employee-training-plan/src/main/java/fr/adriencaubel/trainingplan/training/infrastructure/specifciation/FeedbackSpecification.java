package fr.adriencaubel.trainingplan.training.infrastructure.specifciation;

import fr.adriencaubel.trainingplan.training.domain.Feedback;
import org.springframework.data.jpa.domain.Specification;

public class FeedbackSpecification {

    public static Specification<Feedback> filter(Long trainingId, Long sessionId) {
        Specification<Feedback> specification = Specification.where(null);

        if (trainingId != null) {
            specification = specification.and(belongsToTraining(trainingId));
        }

        if (sessionId != null) {
            specification = specification.and(belongsToSession(sessionId));
        }

        return specification;
    }

    public static Specification<Feedback> belongsToTraining(Long trainingId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("sessionEnrollment").get("session").get("training").get("id"), trainingId);
    }

    public static Specification<Feedback> belongsToSession(Long sessionId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("sessionEnrollment").get("session").get("id"), sessionId);
    }
}
