import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from 'lucide-react';
import api from '@/services/api';

import { Feedback } from '@/types/Feedback';
import { SessionEnrollment } from '@/types/SessionEnrollment';
import { PageResponse } from '@/types/PageResponse';
import Pagination from '../pagination/Pagination';
import { useFeedback } from '@/hooks/useFeedback';

interface FeedbackTabsProps {
    trainingId?: number;
    sessionId?: number;
    pageSize?: number;
}

const FeedbackTabs: React.FC<FeedbackTabsProps> = ({
    trainingId,
    sessionId,
}) => {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);


    const {
        data: feedbacks,
        isLoading: loadingFeedback,
        error: feedbackError,
    } = useFeedback({
        trainingId: trainingId,
        page,
        size: pageSize
    });

    const totalPages = feedbacks?.page.totalPages ?? 0;


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

    if (loadingFeedback)
        return (
            <div className="p-4 text-center text-gray-500">Chargement…</div>
        );

    // In case some other error happened (not a 204), you can still show an error
    if (feedbackError)
        return (
            <div className="p-4 text-center text-red-500">
                Une erreur est survenue.
            </div>
        );

    console.log(feedbacks)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tous les avis reçus</CardTitle>
                <CardDescription>
                    {feedbacks.page.number} avis reçu(s) au total
                </CardDescription>
            </CardHeader>
            <CardContent>
                {feedbacks.page.totalElements > 0 && (
                    <div className="space-y-4">
                        {feedbacks.content.map(fb => (
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
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                />
            </CardContent>
        </Card>
    );
};

export default FeedbackTabs;
