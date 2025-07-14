package fr.adriencaubel.trainingplan.company.infrastructure.repository;

import fr.adriencaubel.trainingplan.company.domain.model.Department;
import org.springframework.data.jpa.domain.Specification;

public class DepartmentSpecifications {

    public static Specification<Department> filter(Long companyId, Long trainingId) {
        Specification<Department> specification = Specification.where(null);

        if (companyId != null) {
            specification = specification.and(hasCompany(companyId));
        }

        if (trainingId != null) {
            specification = specification.and(hasTraining(trainingId));
        }

        return specification;
    }

    public static Specification<Department> hasTraining(Long trainingId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("trainings").get("id"), trainingId);
    }

    private static Specification<Department> hasCompany(Long companyId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("company").get("id"), companyId);
    }
}
