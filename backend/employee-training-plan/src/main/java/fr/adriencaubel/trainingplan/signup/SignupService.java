package fr.adriencaubel.trainingplan.signup;

import com.stripe.model.Customer;
import com.stripe.model.Subscription;
import fr.adriencaubel.trainingplan.common.config.KeycloakService;
import fr.adriencaubel.trainingplan.common.config.StripeClient;
import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.Plan;
import fr.adriencaubel.trainingplan.company.domain.model.User;
import fr.adriencaubel.trainingplan.company.infrastructure.repository.CompanyRepository;
import fr.adriencaubel.trainingplan.company.infrastructure.repository.PlanRepository;
import fr.adriencaubel.trainingplan.signup.controller.RegistrationRequest;
import fr.adriencaubel.trainingplan.signup.controller.RegistrationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SignupService {

    private final PlanRepository planRepository;
    private final StripeClient stripeClient;
    private final KeycloakService keycloakService;
    private final CompanyRepository companyRepository;

    @Transactional
    public RegistrationResponse registerCompany(RegistrationRequest request) {
        try {
            // 1. Create company in database
            Company company = new Company();
            company.setName(request.getCompanyName());

            Customer customer = stripeClient.createCustomer(request.getCompanyName());

            // Assign default plan
            Plan plan = planRepository.findByName("free")
                    .orElseThrow(() -> new IllegalArgumentException("Default plan not found"));

            Subscription subscription = stripeClient.createInitialFreeSubscription(customer.getId());

            company.setName(request.getCompanyName());
            company.setStripeCustomerId(customer.getId());
            company.setPlan(plan);
            company.setSubscriptionStatus("free");
            company.setStripeSubscriptionId(subscription.getId());
            company = companyRepository.save(company);

            // 2. Create user in Keycloak first
            String keycloakUserId = keycloakService.createUser(
                    request.getEmail(),
                    request.getPassword(),
                    request.getFirstName(),
                    request.getLastName(),
                    company.getId()
            );

            // 4. Create user in local database
            User user = new User();
            user.setSub(keycloakUserId);
            user.setCompany(company);
            user.setRole(User.Role.OWNER);

            company.addUser(user);

            return new RegistrationResponse(company.getId(), user.getId(), "Registration successful");

        } catch (Exception e) {
            // Rollback Keycloak user if database operations fail
            throw new DomainException("Registration failed: " + e);
        }
    }
}
