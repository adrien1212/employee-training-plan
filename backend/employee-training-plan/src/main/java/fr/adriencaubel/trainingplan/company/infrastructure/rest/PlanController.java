package fr.adriencaubel.trainingplan.company.infrastructure.rest;

import com.stripe.exception.StripeException;
import com.stripe.model.CustomerSession;
import com.stripe.model.checkout.Session;
import fr.adriencaubel.trainingplan.common.config.StripeClient;
import fr.adriencaubel.trainingplan.company.application.dto.ChangePlanRequest;
import fr.adriencaubel.trainingplan.company.application.dto.PlanResponseModel;
import fr.adriencaubel.trainingplan.company.application.service.PlanService;
import fr.adriencaubel.trainingplan.company.application.service.UserService;
import fr.adriencaubel.trainingplan.company.domain.model.Plan;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("v1/plans")
@RequiredArgsConstructor
public class PlanController {
    private final PlanService planService;

    private final UserService userService;

    private final StripeClient stripeClient;

    @GetMapping
    public ResponseEntity<Page<PlanResponseModel>> getAllPlans(Pageable pageable) {
        Page<Plan> plans = planService.findAll(pageable);
        return ResponseEntity.ok(plans.map(PlanResponseModel::toDto));
    }

    @GetMapping("/current")
    public ResponseEntity<PlanResponseModel> getCurrentPlan() {
        Plan currentPlan = planService.getCurrentPlan();
        return ResponseEntity.ok(PlanResponseModel.toDto(currentPlan));
    }

    @PatchMapping
    public ResponseEntity<Map<String, String>> changePlan(
            @RequestBody ChangePlanRequest request) throws StripeException {
        Session session = planService.changePlan(request.getId());

        return null;
    }

    @PostMapping("/portal")
    public ResponseEntity<Void> openPortal(
    ) {
        try {
            String stripeCustomerId = userService.getCompanyOfAuthenticatedUser().getStripeCustomerId();

            // 1) Create the portal session
            com.stripe.model.billingportal.Session session =
                    stripeClient.createBillingPortalSession(stripeCustomerId, "http://localhost:5173");

            // 2) Redirect the browser to Stripe’s hosted portal URL
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.LOCATION, session.getUrl());
            return ResponseEntity.status(302).headers(headers).build();
        } catch (com.stripe.exception.StripeException e) {
            // Log & return 500 on failure
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Et appelé par la pricing table créer par stripe pour créer une session a chaque utilisateur
     *
     * @return
     * @throws StripeException
     */
    @PostMapping("/create-pricing-session")
    public ResponseEntity<Map<String, String>> createPricingSession() throws StripeException {
        String customerId = userService.getCompanyOfAuthenticatedUser().getStripeCustomerId();

        // Build the `components` → `pricing_table` map
        Map<String, Object> pricingTable = new HashMap<>();
        pricingTable.put("enabled", true);

        Map<String, Object> components = new HashMap<>();
        components.put("pricing_table", pricingTable);

        // Assemble parameters for Customer Session creation
        Map<String, Object> params = new HashMap<>();
        params.put("customer", customerId);
        params.put("components", components);

        // Create the session (returns a single-use client_secret) :contentReference[oaicite:0]{index=0}
        CustomerSession session = CustomerSession.create(params);

        // Return only the client_secret to the front-end
        return ResponseEntity.ok(
                Collections.singletonMap("client_secret", session.getClientSecret())
        );
    }
}

