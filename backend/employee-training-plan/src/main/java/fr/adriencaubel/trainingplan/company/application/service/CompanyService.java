package fr.adriencaubel.trainingplan.company.application.service;


import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.infrastructure.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserService userService;


//    @Deprecated USE registerCompany
//    @Transactional
//    public Company createCompany(CreateCompanyRequestModel command, User user) {
//        try {
//            // Create Stripe Customer
//            CustomerCreateParams params =
//                    CustomerCreateParams.builder()
//                            .setName(command.getCompanyName())
//                            .build();
//
//            Customer customer = stripeClient.createCustomer(command.getCompanyName());
//
//            // Assign default plan
//            Plan plan = planRepository.findByName("free")
//                    .orElseThrow(() -> new IllegalArgumentException("Default plan not found"));
//
//            Subscription subscription = stripeClient.createInitialFreeSubscription(customer.getId());
//
//            Company company = new Company();
//            company.setName(command.getCompanyName());
//            company.setStripeCustomerId(customer.getId());
//            company.setPlan(plan);
//            company.setSubscriptionStatus("free");
//            company.setStripeSubscriptionId(subscription.getId());
//
//            // Persist company first to generate ID
//            Company saved = companyRepository.save(company);
//
//            // Attach existing User as managed entity
//            saved.addUser(user);
//            return companyRepository.save(saved);
//        } catch (StripeException e) {
//            throw new RuntimeException("Failed to create Stripe customer", e);
//        }
//    }

    public Company getCurrentCompany() {
        Company company = userService.getCompanyOfAuthenticatedUser();
        return company;
    }
}