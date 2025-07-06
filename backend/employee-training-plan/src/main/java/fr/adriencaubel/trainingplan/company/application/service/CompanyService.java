package fr.adriencaubel.trainingplan.company.application.service;


import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Subscription;
import com.stripe.param.CustomerCreateParams;
import fr.adriencaubel.trainingplan.common.config.StripeClient;
import fr.adriencaubel.trainingplan.company.application.dto.CreateCompanyRequestModel;
import fr.adriencaubel.trainingplan.company.application.dto.CreateDepartementRequestModel;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import fr.adriencaubel.trainingplan.company.domain.model.Plan;
import fr.adriencaubel.trainingplan.company.domain.model.User;
import fr.adriencaubel.trainingplan.company.infrastructure.repository.CompanyRepository;
import fr.adriencaubel.trainingplan.company.infrastructure.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    private final PlanRepository planRepository;

    private final UserService userService;

    private final StripeClient stripeClient;

    @Transactional
    public Company createCompany(CreateCompanyRequestModel command, User user) {
        try {
            // Create Stripe Customer
            CustomerCreateParams params =
                    CustomerCreateParams.builder()
                            .setName(command.getCompanyName())
                            .build();

            Customer customer = stripeClient.createCustomer(command.getCompanyName());

            // Assign default plan
            Plan plan = planRepository.findByName("free")
                    .orElseThrow(() -> new IllegalArgumentException("Default plan not found"));

            Subscription subscription = stripeClient.createInitialFreeSubscription(customer.getId());

            Company company = new Company();
            company.setName(command.getCompanyName());
            company.setStripeCustomerId(customer.getId());
            company.setPlan(plan);
            company.setSubscriptionStatus("free");
            company.setStripeSubscriptionId(subscription.getId());

            // Persist company first to generate ID
            Company saved = companyRepository.save(company);

            // Attach existing User as managed entity
            saved.addUser(user);
            return companyRepository.save(saved);
        } catch (StripeException e) {
            throw new RuntimeException("Failed to create Stripe customer", e);
        }
    }

    @Transactional
    public Department addDepartment(CreateDepartementRequestModel command) {
        Company company = userService.getCompanyOfAuthenticatedUser();

        Department department = new Department(command.getDepartmentName());
        company.addDepartment(department);

        companyRepository.save(company);
        return department;
    }

    public Company getCurrentCompany() {
        Company company = userService.getCompanyOfAuthenticatedUser();
        return company;
    }
}