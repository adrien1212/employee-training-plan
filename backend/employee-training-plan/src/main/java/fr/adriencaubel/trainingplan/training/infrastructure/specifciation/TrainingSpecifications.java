package fr.adriencaubel.trainingplan.training.infrastructure.specifciation;

import fr.adriencaubel.trainingplan.company.domain.model.Department;
import fr.adriencaubel.trainingplan.training.domain.Training;
import fr.adriencaubel.trainingplan.training.domain.TrainingStatus;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
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
            } else {
                predicate = criteriaBuilder.and(predicate, allDepartment().toPredicate(root, query, criteriaBuilder));
            }
            if (employeeId != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("sessions").get("sessionEnrollments").get("id"), employeeId));
            }

            return predicate;
        };
    }

    public static Specification<Training> hasCompany(Long companyId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("company").get("id"), companyId);
    }

    public static Specification<Training> hasStatus(TrainingStatus status) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), status);
    }

    public static Specification<Training> belongsTo(Long departmentId) {
        return (root, query, cb) -> {
            // join (no fetch) since you only need the predicate
            Join<Training, Department> dept = root.join("departments", JoinType.INNER);
            return cb.equal(dept.get("id"), departmentId);
        };
    }

    public static Specification<Training> allDepartment() {
        return (root, query, cb) -> {
            // only add fetch for the root query (not for count queries)
            if (Training.class.equals(query.getResultType())) {
                root.fetch("departments", JoinType.LEFT);
                query.distinct(true);
            }
            // no where-clause, so return a dummy predicate
            return cb.conjunction();
        };
    }
}
