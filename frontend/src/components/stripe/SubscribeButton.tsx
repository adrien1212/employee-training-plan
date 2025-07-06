import { useChangePlan } from "@/hooks/usePlan";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useState } from "react";

export function SubscribeButton({ planId }) {
    const stripePromise = loadStripe("pk_test_51RfFu3FJFVKSl5Ty8nwLSYeXub32PvmuDYsfp62MfElRhqRY0aOxCLMBWN7EUAkmsFbNMIwYwIFRct8jImUPvS8u00iyxWMaVO");

    const changePlanMutation = useChangePlan();

    const [loading, setLoading] = useState(false);
    const handleClick = () => {
        setLoading(true);

        changePlanMutation.mutate(
            { id: planId },
            {
                onSuccess: async ({ sessionId, checkoutUrl }) => {
                    try {
                        const stripe: Stripe | null = await stripePromise;
                        if (!stripe) throw new Error('Stripe.js failed to load');

                        const { error } = await stripe.redirectToCheckout({ sessionId });
                        if (error) {
                            console.error('Stripe redirect error:', error.message);
                        }
                    } catch (err) {
                        console.error('Checkout error:', err);
                    } finally {
                        setLoading(false);
                    }
                },
                onError: (err) => {
                    console.error('Change plan failed:', err.message);
                    setLoading(false);
                },
            }
        );
    };

    return (
        <button onClick={handleClick} disabled={loading}>
            {loading ? 'Loading…' : 'Subscribe'}
        </button>
    );
}