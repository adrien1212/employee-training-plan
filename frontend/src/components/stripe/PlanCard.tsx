import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SubscribeButton } from './SubscribeButton';


export default function PlanCard({ plan, index, chosenPlan }) {
    const isSelected = chosenPlan

    const priceLabel =
        plan.price === 0 ? 'Gratuit' :
            plan.price != null ? `${plan.price} €/mois` :
                'Sur demande';

    return (
        <Card className={`flex-1 border ${isSelected ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'}`}>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle>{plan.name}</CardTitle>
                    {isSelected && <Badge color="green">Votre plan</Badge>}
                </div>
                <div className="text-sm font-medium text-gray-600 mb-1">{plan.range}</div>
                <div className="text-xs text-muted-foreground">{plan.description}</div>
            </CardHeader>

            <CardContent>
                <div className="text-2xl font-bold mb-2">{priceLabel}</div>
                {/* <ul className="text-sm space-y-1 mb-3">
                    {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-400 inline-block" />
                            {feature}
                        </li>
                    ))}
                </ul> */}

            </CardContent>

            <CardFooter className="flex flex-col gap-2">
                {index < 3 ? (
                    <SubscribeButton planId={plan.id} />
                ) : (
                    <Button variant="outline">Contactez-nous</Button>
                )}
            </CardFooter>
        </Card>
    );
}