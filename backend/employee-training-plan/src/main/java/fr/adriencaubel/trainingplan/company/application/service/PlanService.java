package fr.adriencaubel.trainingplan.company.application.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import fr.adriencaubel.trainingplan.common.config.StripeClient;
import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.Plan;
import fr.adriencaubel.trainingplan.company.infrastructure.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanRepository planRepository;
    private final UserService userService;
    private final StripeClient stripeClient;

    @Value("${stripe.api.key}")
    private String STRIPE_API_KEY;

    public Plan getCurrentPlan() {
        Company company = userService.getCompanyOfAuthenticatedUser();
        return company.getPlan();
    }

    public Page<Plan> findAll(Pageable pageable) {
        return planRepository.findAll(pageable);
    }

    public Session changePlan(Long newPlanId) throws StripeException {
        Stripe.apiKey = STRIPE_API_KEY;

        Plan newPlan = planRepository.findById(newPlanId).orElseThrow(() -> new DomainException("Plan not found"));

        Company company = userService.getCompanyOfAuthenticatedUser();

        return stripeClient.createOrUpdateSubscription(company.getStripeCustomerId(), newPlan.getStripePriceId());
    }
}
