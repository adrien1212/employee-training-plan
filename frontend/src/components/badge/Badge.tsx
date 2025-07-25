import { Badge } from '@/components/ui/badge';

const statusMap = {
    NOT_STARTED: { label: 'Programmée', style: 'bg-blue-100 text-blue-800' },
    ACTIVE: { label: 'En cours', style: 'bg-green-100 text-green-800' },
    COMPLETED: { label: 'Terminée', style: 'bg-gray-100 text-gray-800' },
    CANCELLED: { label: 'Annulée', style: 'bg-red-100 text-red-800' },
    DRAFT: { label: 'À l’étude', style: 'bg-orange-100 text-orange-800' },
} as const;

export function StatusBadge({ status }: { status: keyof typeof statusMap }) {
    const cfg = statusMap[status] ?? statusMap.DRAFT;
    return <Badge className={cfg.style}>{cfg.label}</Badge>;
}

export function FeedbackBadge({ hasFeedback }: { hasFeedback: boolean }) {
    const cfg = hasFeedback
        ? { label: 'oui', style: 'bg-green-100 text-green-800' }
        : { label: 'non', style: 'bg-red-100 text-orange-800' };
    return <Badge className={cfg.style}>{cfg.label}</Badge>;
}

export function SignatureBadge({ signed }: { signed: boolean }) {
    const cfg = signed
        ? { label: 'Signée', style: 'bg-green-100 text-green-800' }
        : { label: 'En attente', style: 'bg-orange-100 text-orange-800' };
    return <Badge className={cfg.style}>{cfg.label}</Badge>;
}