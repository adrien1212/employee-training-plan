package fr.adriencaubel.trainingplan.company.application.dto;

import fr.adriencaubel.trainingplan.company.domain.model.Company;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyResponseModel {
    private Long id;
    private String name;
    private String stripeCustomerId;

    public static CompanyResponseModel toDTO(Company company) {
        CompanyResponseModel companyResponseModel = new CompanyResponseModel();
        companyResponseModel.setId(company.getId());
        companyResponseModel.setName(company.getName());
        companyResponseModel.setStripeCustomerId(company.getStripeCustomerId());
        return companyResponseModel;
    }
}
