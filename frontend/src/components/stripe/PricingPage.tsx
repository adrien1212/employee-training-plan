import { useCurrentCompany } from '@/hooks/useCompanies';
import { useCreatePricingSession } from '@/hooks/usePlan';
import React, { useEffect, useState } from 'react';

interface SessionResponse {
  client_secret: string;
}

// If using TypeScript, add the following snippet to your file as well.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export default function PrincingStripe() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { mutate, isLoading: isMutating, error: mutateError } = useCreatePricingSession();

  const {
    data,
    isLoading: isLoadingCompany,
    isError: companyError
  } = useCurrentCompany();

  // 1. On ne déclenche la mutation que lorsque `data` est défini
  useEffect(() => {
    if (!isLoadingCompany && data?.stripeCustomerId) {
      mutate(
        { stripeCustomerId: data.stripeCustomerId },
        {
          onSuccess: ({ client_secret }) => {
            setClientSecret(client_secret);
          },
        }
      );
    }
    // On inclut `data` et `isLoadingCompany` dans le tableau de dépendances
  }, [mutate, data, isLoadingCompany]);

  if (isLoadingCompany || isMutating) return <p>Chargement…</p>;
  if (companyError) return <p>Erreur chargement société</p>;
  if (mutateError) return <p>Erreur : {mutateError.message}</p>;
  if (!clientSecret) return null;

  console.log(data.stripeCustomerId)

  return (
    <>
      <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      <stripe-pricing-table
        pricing-table-id="prctbl_1RfkmOFJFVKSl5TyKPZPSECl"
        publishable-key="pk_test_51RfFu3FJFVKSl5Ty8nwLSYeXub32PvmuDYsfp62MfElRhqRY0aOxCLMBWN7EUAkmsFbNMIwYwIFRct8jImUPvS8u00iyxWMaVO"
        customer-session-client-secret={clientSecret}
      />
    </>
  );
}