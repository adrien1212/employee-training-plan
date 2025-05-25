package fr.adriencaubel.trainingplan.training.infrastructure.specifciation;

import fr.adriencaubel.trainingplan.training.domain.Training;
import fr.adriencaubel.trainingplan.training.domain.TrainingStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public class TrainingSpecifications {

    public static Specification<Training> filter(Long companyId, TrainingStatus status, Long departmentId, Long employeeId) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            Predicate predicate = criteriaBuilder.conjunction();

            if (companyId != null) {
                predicate = criteriaBuilder.and(predicate, hasCompany(companyId).toPredicate(root, query, criteriaBuilder));
            }
            if (status != null) {
                predicate = criteriaBuilder.and(predicate, hasStatus(status).toPredicate(root, query, criteriaBuilder));
            }
            if (departmentId != null) {
                predicate = criteriaBuilder.and(predicate, belongsTo(departmentId).toPredicate(root, query, criteriaBuilder));
            }
            if (employeeId != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("sessions").get("sessionEnrollments").get("id"), employeeId));
            }

            return predicate;
        };
    }

    public static Specification<Training> hasCompany(Long companyId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("departments").get("company").get("id"), companyId);
    }

    public static Specification<Training> hasStatus(TrainingStatus status) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), status);
    }

    public static Specification<Training> belongsTo(Long departmentId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("departments").get("id"), departmentId);
    }
}
