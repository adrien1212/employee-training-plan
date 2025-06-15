import useFeedback from "@/hooks/useFeedback"
import { SessionDetail } from "@/types/SessionDetail"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from "../ui/button"

interface FeedbackModalProps {
    open: boolean
    onClose: () => void
    session: SessionDetail
}

const renderStars = (rating: number) =>
    '★'.repeat(rating) + '☆'.repeat(5 - rating)

export default function FeedbackPopup({ open, onClose, session }: FeedbackModalProps) {
    const sessionId = session.id
    const title = session.training.title

    // Fetch feedbacks when modal is open
    const {
        data: feedbacks,
        isLoading,
        error,
    } = useFeedback({ sessionId: sessionId, enabled: open })

    return (
        <Dialog open={open} onOpenChange={val => !val && onClose()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Feedbacks
                    </DialogTitle>
                </DialogHeader>

                {isLoading && <div>Loading feedback…</div>}
                {error && (
                    <div className="text-red-500">
                        Error loading feedback
                    </div>
                )}

                {!isLoading && !error && (
                    feedbacks.content.length
                        ? feedbacks.content.map(fb => (
                            <div key={fb.id} className="mb-4">
                                <div className="font-semibold">
                                    <div className="text-yellow-500">
                                        {renderStars(fb.rating)}
                                    </div>
                                </div>
                                <p>{fb.comment}</p>
                            </div>
                        ))
                        : <div className="text-gray-500">No feedback yet.</div>
                )}

                <DialogFooter className="flex justify-end gap-2">
                    <Button onClick={onClose}>
                        Fermer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
