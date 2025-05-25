package fr.adriencaubel.trainingplan.company.application.service;


import fr.adriencaubel.trainingplan.company.application.dto.CreateCompanyRequestModel;
import fr.adriencaubel.trainingplan.company.application.dto.CreateDepartementRequestModel;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import fr.adriencaubel.trainingplan.company.domain.model.User;
import fr.adriencaubel.trainingplan.company.infrastructure.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    private final UserService userService;

    @Transactional
    public Company createCompany(CreateCompanyRequestModel command, User user) {
        Company company = new Company(command.getCompanyName(), user);
        return companyRepository.save(company);
    }

    @Transactional
    public Department addDepartment(CreateDepartementRequestModel command) {
        Company company = userService.getCompanyOfAuthenticatedUser();

        Department department = new Department(command.getDepartmentName());
        company.addDepartment(department);

        companyRepository.save(company);
        return department;
    }
}