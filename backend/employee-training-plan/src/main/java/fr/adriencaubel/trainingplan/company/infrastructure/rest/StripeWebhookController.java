package fr.adriencaubel.trainingplan.company.infrastructure.rest;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Charge;
import com.stripe.model.Event;
import com.stripe.model.Invoice;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhook")
@RequiredArgsConstructor
public class StripeWebhookController {
    private final StripeSubscriptionService subscriptionService;
    @Value("${stripe.webhookSecret}")
    private String webhookSecret;
    @Value("${stripe.api.key}")
    private String apiKey;

    @PostMapping()
    public ResponseEntity<String> handleWebhook(
            @RequestHeader("Stripe-Signature") String sigHeader,
            @RequestBody String payload) {

        Event event;

        try {
            // Verify signature
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("⚠️ Invalid signature");
        }

        switch (event.getType()) {
            case "checkout.session.completed": {
                Session session = (Session) event.getDataObjectDeserializer()
                        .getObject().orElse(null);
                subscriptionService.handleCheckoutSession(session);
                break;
            }
            case "charge.succeeded": {
                Charge charge = (Charge) event.getDataObjectDeserializer()
                        .getObject().orElse(null);
                subscriptionService.handlePaimentSucceded(charge);
                break;
            }
            case "invoice.paid": {
                Invoice invoice = (Invoice) event.getDataObjectDeserializer()
                        .getObject().orElse(null);
                subscriptionService.handleInvoicePaid(invoice);
                break;
            }
            case "customer.subscription.created":
                break;
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                Subscription subscription = (Subscription) event.getDataObjectDeserializer()
                        .getObject().orElse(null);
                subscriptionService.handleSubscriptionEvent(subscription);
                break;
            }
            default:
                // Ignore other events
        }

        return ResponseEntity.ok("");
    }
}