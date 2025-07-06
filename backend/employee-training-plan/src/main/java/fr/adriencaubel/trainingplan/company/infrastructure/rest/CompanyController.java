package fr.adriencaubel.trainingplan.company.infrastructure.rest;

import fr.adriencaubel.trainingplan.company.application.dto.CompanyResponseModel;
import fr.adriencaubel.trainingplan.company.application.dto.CreateCompanyRequestModel;
import fr.adriencaubel.trainingplan.company.application.dto.CreateDepartementRequestModel;
import fr.adriencaubel.trainingplan.company.application.service.CompanyService;
import fr.adriencaubel.trainingplan.company.application.service.DepartmentService;
import fr.adriencaubel.trainingplan.company.application.service.UserService;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import fr.adriencaubel.trainingplan.company.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    private final DepartmentService departmentService;

    private final UserService userService;

    @GetMapping
    public ResponseEntity<CompanyResponseModel> getCurrentCompany() {
        Company company = companyService.getCurrentCompany();
        CompanyResponseModel companyResponseModel = CompanyResponseModel.toDTO(company);
        return new ResponseEntity<>(companyResponseModel, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<CompanyResponseModel> createCompany(@RequestBody CreateCompanyRequestModel createCompanyRequestModel, @AuthenticationPrincipal Jwt jwt) {
        User user = userService.findByJwt(jwt);
        Company company = companyService.createCompany(createCompanyRequestModel, user);
        CompanyResponseModel companyResponseModel = CompanyResponseModel.toDTO(company);
        return new ResponseEntity<>(companyResponseModel, HttpStatus.CREATED);
    }

    @PostMapping("/departments")
    public ResponseEntity<Department> addDepartment(@RequestBody CreateDepartementRequestModel createDepartementRequestModel,
                                                    @AuthenticationPrincipal OidcUser oidcUser) {
        Department department = companyService.addDepartment(createDepartementRequestModel);
        return new ResponseEntity<>(department, HttpStatus.CREATED);
    }
}