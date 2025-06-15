import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from 'lucide-react';
import api from '@/services/api';

import useFeedback from '@/hooks/useFeedback'; // ← your hook
import { Feedback } from '@/types/Feedback';
import { SessionEnrollment } from '@/types/SessionEnrollment';
import { PageResponse } from '@/types/PageResponse';

type EnrichedFeedback = Feedback & { sessionEnrollment: SessionEnrollment };

interface FeedbackTabsProps {
    trainingId?: number;
    sessionId?: number;
    pageSize?: number;
}

const FeedbackTabs: React.FC<FeedbackTabsProps> = ({
    trainingId,
    sessionId,
    pageSize = 10,
}) => {
    // pagination
    const [page, setPage] = useState(0);

    // reset to first page when filters change
    useEffect(() => {
        setPage(0);
    }, [trainingId, sessionId]);

    // 1️⃣ get raw feedbacks via your custom hook
    const {
        data: feedbackPage,
        isLoading: loadingFeedback,
        error: feedbackError,
    } = useFeedback({
        page,
        size: pageSize
    });

    // 2️⃣ local state for the enriched page
    const [enrichedPage, setEnrichedPage] = useState<PageResponse<EnrichedFeedback> | null>(null);
    const [loadingEnroll, setLoadingEnroll] = useState(false);
    const [errorEnroll, setErrorEnroll] = useState<string | null>(null);

    // 3️⃣ whenever we get a new feedbackPage, fetch all enrollments
    useEffect(() => {
        if (!feedbackPage) {
            setEnrichedPage(null);
            return;
        }

        setLoadingEnroll(true);
        setErrorEnroll(null);

        const loadEnrollments = async () => {
            try {
                const enrichedContent = await Promise.all(
                    feedbackPage.content.map(async (fb) => {
                        const se = await api
                            .get<SessionEnrollment>(`/v1/sessions-enrollment/${fb.sessionEnrollmentId}`)
                            .then(res => res.data);
                        return { ...fb, sessionEnrollment: se };
                    })
                );

                setEnrichedPage({
                    ...feedbackPage,
                    content: enrichedContent,
                });
            } catch (err) {
                console.error('Error loading enrollments', err);
                setErrorEnroll('Failed to load session details.');
            } finally {
                setLoadingEnroll(false);
            }
        };

        loadEnrollments();
    }, [feedbackPage]);

    // aggregate loading & error
    const isLoading = loadingFeedback || loadingEnroll;
    const error = feedbackError || errorEnroll;

    const feedbacks = enrichedPage?.content ?? [];

    const getInitials = (name: string) =>
        name
            .split(' ')
            .map(w => w[0])
            .join('')
            .toUpperCase();

    const renderStars = (rating: number) => (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star}
                    className={`h-4 w-4 ${star <= rating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                        }`}
                />
            ))}
            <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tous les avis reçus</CardTitle>
                <CardDescription>
                    {feedbacks.length} avis reçu(s) au total
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="p-4 text-center text-gray-500">Loading…</div>
                )}
                {error && (
                    <div className="p-4 text-center text-red-500">{String(error)}</div>
                )}
                {!isLoading && !error && feedbacks.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                        No feedback available.
                    </div>
                )}

                {!isLoading && !error && feedbacks.length > 0 && (
                    <div className="space-y-4">
                        {feedbacks.map(fb => (
                            <div key={fb.id} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback className="bg-blue-100 text-blue-700">
                                                {getInitials(
                                                    `${fb.sessionEnrollment.employee.firstName} ${fb.sessionEnrollment.employee.lastName}`
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">
                                                {`${fb.sessionEnrollment.employee.firstName} ${fb.sessionEnrollment.employee.lastName}`}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {fb.sessionEnrollment.employee.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">
                                            {fb.submittedAt}
                                        </div>
                                        <Badge variant="outline" className="mt-1">
                                            {fb.sessionEnrollment.session.training.title}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="mb-2">{renderStars(fb.rating ?? 0)}</div>
                                <p className="text-gray-700">{fb.comment}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && !error && enrichedPage && enrichedPage.totalPages > 1 && (
                    <div className="flex justify-between items-center p-4">
                        <Button
                            disabled={page <= 0}
                            onClick={() => setPage(p => Math.max(p - 1, 0))}
                        >
                            Previous
                        </Button>
                        <span>
                            Page {page + 1} of {enrichedPage.totalPages}
                        </span>
                        <Button
                            disabled={page + 1 >= enrichedPage.totalPages}
                            onClick={() =>
                                setPage(p => Math.min(p + 1, enrichedPage.totalPages - 1))
                            }
                        >
                            Next
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default FeedbackTabs;
