// src/components/SessionFeedbackForm.tsx

import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Textarea,
  HStack,
  IconButton,
  Button,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import api from '../../service/api';

interface SessionFeedbackFormProps {
  feedbackToken: string;
  onSuccess?: () => void;
}

const SessionFeedbackForm: React.FC<SessionFeedbackFormProps> = ({
  feedbackToken,
  onSuccess,
}) => {
  const toast = useToast();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const submitFeedback = async () => {
    if (!comment.trim() || rating < 1 || rating > 5) {
      toast({
        title: 'Please provide a comment and a rating (1–5 stars).',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);
    try {
      // POST to /feedback/{feedbackToken} with { comment, rating }
      await api.post(`v1/feedbacks/${feedbackToken}`, {
        comment: comment.trim(),
        rating,
      });
      toast({
        title: 'Feedback submitted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setComment('');
      setRating(0);
      onSuccess?.();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit feedback.';
      toast({
        title: 'Submission Error',
        description: msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Heading size="sm" mb={4}>
        Your Feedback
      </Heading>
      <VStack align="start" spacing={4}>
        <Box width="100%">
          <Text mb={1}>Comment:</Text>
          <Textarea
            placeholder="Enter your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            resize="vertical"
          />
        </Box>
        <Box>
          <Text mb={1}>Rating:</Text>
          <HStack>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconButton
                key={star}
                aria-label={`${star} star`}
                icon={<StarIcon />}
                colorScheme={star <= rating ? 'yellow' : 'gray'}
                variant="ghost"
                fontSize="2xl"
                onClick={() => setRating(star)}
              />
            ))}
          </HStack>
        </Box>
        <Button
          colorScheme="teal"
          onClick={submitFeedback}
          isLoading={submitting}
        >
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default SessionFeedbackForm;
