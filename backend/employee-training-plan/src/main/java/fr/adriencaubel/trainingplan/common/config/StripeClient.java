package fr.adriencaubel.trainingplan.common.config;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Subscription;
import com.stripe.model.SubscriptionCollection;
import com.stripe.model.checkout.Session;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.SubscriptionCreateParams;
import com.stripe.param.SubscriptionListParams;
import com.stripe.param.SubscriptionUpdateParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class StripeClient {

    private final String domainUrl = "https://localhost:8080";

    public StripeClient(@Value("${stripe.api.key}") String apiKey) {
        Stripe.apiKey = apiKey;
    }

    public Customer createCustomer(String companyName) throws StripeException {
        CustomerCreateParams params = CustomerCreateParams.builder()
                .setName(companyName)
                .build();
        return Customer.create(params);
    }

    public Subscription createInitialFreeSubscription(String customerId) throws StripeException {
        SubscriptionCreateParams params = SubscriptionCreateParams.builder()
                .setCustomer(customerId)
                .addItem(SubscriptionCreateParams.Item.builder()
                        .setPrice("price_1RfGHiFJFVKSl5TyoUar5JVG")
                        .build())
                .setTrialPeriodDays(14L)
                .build();
        return Subscription.create(params);
    }

    public Session createOrUpdateSubscription(String customerId, String priceId) throws StripeException {
        // 1) List any ACTIVE subscriptions
        SubscriptionListParams listParams = SubscriptionListParams.builder()
                .setCustomer(customerId)
                .setStatus(SubscriptionListParams.Status.ACTIVE)
                .build();
        SubscriptionCollection existingSubs = Subscription.list(listParams);

        if (!existingSubs.getData().isEmpty()) {
            // 2a) We found one: swap its price
            Subscription existing = existingSubs.getData().get(0);
            String currentItemId = existing.getItems().getData().get(0).getId();

            SubscriptionUpdateParams updateParams = SubscriptionUpdateParams.builder()
                    .addItem(SubscriptionUpdateParams.Item.builder()
                            .setId(currentItemId)
                            .setPrice(priceId)
                            .build())
                    // Prorate immediately; you can change to NO_PRORATION if you want
                    .setProrationBehavior(SubscriptionUpdateParams.ProrationBehavior.CREATE_PRORATIONS)
                    .build();

            Subscription updated = existing.update(updateParams);
            // If you really want to send them to Setup or a portal, you'd handle that separately.
            // Here we return `null` to indicate “handled by update” — adjust as you like:
            return null;
        } else {
            // 2b) No active subscription → spin up a new Checkout Session
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                    .setCustomer(customerId)
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setPrice(priceId)
                            .setQuantity(1L)
                            .build())
                    .setSuccessUrl(domainUrl + "/checkout/success?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(domainUrl + "/pricing")
                    .build();

            return Session.create(params);
        }
    }

    public com.stripe.model.billingportal.Session createBillingPortalSession(
            String customerId,
            String returnUrl
    ) throws com.stripe.exception.StripeException {
        com.stripe.param.billingportal.SessionCreateParams params =
                com.stripe.param.billingportal.SessionCreateParams.builder()
                        .setCustomer(customerId)
                        .setReturnUrl(returnUrl)
                        .build();
        return com.stripe.model.billingportal.Session.create(params);
    }
}