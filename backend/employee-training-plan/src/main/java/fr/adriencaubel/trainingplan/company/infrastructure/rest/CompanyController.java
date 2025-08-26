package fr.adriencaubel.trainingplan.company.infrastructure.rest;

import fr.adriencaubel.trainingplan.company.application.dto.CompanyResponseModel;
import fr.adriencaubel.trainingplan.company.application.service.CompanyService;
import fr.adriencaubel.trainingplan.company.application.service.UserService;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    private final UserService userService;

    @GetMapping
    public ResponseEntity<CompanyResponseModel> getCurrentCompany() {
        Company company = companyService.getCurrentCompany();
        CompanyResponseModel companyResponseModel = CompanyResponseModel.toDTO(company);
        return new ResponseEntity<>(companyResponseModel, HttpStatus.OK);
    }
}