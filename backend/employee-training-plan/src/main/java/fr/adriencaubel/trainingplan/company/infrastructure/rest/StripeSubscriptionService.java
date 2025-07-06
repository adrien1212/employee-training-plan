package fr.adriencaubel.trainingplan.company.infrastructure.rest;

import com.stripe.model.Charge;
import com.stripe.model.Invoice;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.Plan;
import fr.adriencaubel.trainingplan.company.infrastructure.repository.CompanyRepository;
import fr.adriencaubel.trainingplan.company.infrastructure.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class StripeSubscriptionService {

    private final CompanyRepository companyRepository;

    private final PlanRepository planRepository;

    @Transactional
    public void handleCheckoutSession(Session session) {
        try {
            String customerId = session.getCustomer();
            String subscriptionId = session.getSubscription();

            com.stripe.model.Subscription subscription =
                    com.stripe.model.Subscription.retrieve(subscriptionId);

            Long periodEndTs = subscription.getEndedAt();
            String stripePriceId = subscription.getItems().getData().get(0).getPrice().getId();

            Plan plan = planRepository.findByStripePriceId(stripePriceId).orElseThrow(() -> new DomainException("Plan not found")); // maybe process to refund if crash

            Company company = companyRepository.findByStripeCustomerId(customerId).orElseThrow(() -> new RuntimeException("Company not found")); // maybe process to refund ...

            company.setStripeSubscriptionId(subscriptionId);
            //
            company.setPlan(plan);

            companyRepository.save(company);
        } catch (Exception e) {
            // process to refund
            throw new RuntimeException("Error while handling checkout session", e);
        }
    }

    public void handleInvoicePaid(Invoice invoice) {
        String subscriptionId = invoice.getId();
        // update next billing date, notify user
    }

    public void handleSubscriptionEvent(Subscription subscription) {
        Company company = companyRepository.findByStripeCustomerId(subscription.getCustomer()).orElseThrow(() -> new RuntimeException("Company not found"));
        if (subscription.getCancelAt() != null) {
            LocalDate cancelAt = Instant.ofEpochSecond(subscription.getCancelAt()).atZone(ZoneId.systemDefault()).toLocalDate();
            company.setCurrentPeriodEnd(cancelAt);
        } else if (subscription.getStartDate() != null) {
            LocalDate updateDate = Instant.ofEpochSecond(subscription.getStartDate()).atZone(ZoneId.systemDefault()).toLocalDate();
            updateDate = updateDate.plusMonths(1);

            Plan plan = planRepository.findByStripePriceId(subscription.getItems().getData().get(0).getPrice().getId()).orElseThrow(() -> new DomainException("Plan not found"));

            company.setPlan(plan);
            company.setCurrentPeriodEnd(updateDate);
        }

        companyRepository.save(company);
    }

    public void handlePaimentSucceded(Charge charge) {
        String customerId = charge.getCustomer();
        //String subscriptionId = charge.get();
    }
}
