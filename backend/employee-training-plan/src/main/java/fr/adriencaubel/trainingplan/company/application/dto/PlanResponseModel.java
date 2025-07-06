package fr.adriencaubel.trainingplan.company.application.dto;

import fr.adriencaubel.trainingplan.company.domain.model.Plan;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PlanResponseModel {
    private Long id;
    private String name;
    private Integer maxEmployees;
    private BigDecimal price;

    public static PlanResponseModel toDto(Plan plan) {
        PlanResponseModel planResponseModel = new PlanResponseModel();
        planResponseModel.setId(plan.getId());
        planResponseModel.setName(plan.getName());
        planResponseModel.setMaxEmployees(plan.getMaxEmployees());
        planResponseModel.setPrice(plan.getPrice());
        return planResponseModel;
    }
}
