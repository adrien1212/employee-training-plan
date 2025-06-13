package fr.adriencaubel.trainingplan.training.application;

import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.training.application.dto.FeedbackRequestModel;
import fr.adriencaubel.trainingplan.training.domain.Feedback;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import fr.adriencaubel.trainingplan.training.infrastructure.FeedbackRepository;
import fr.adriencaubel.trainingplan.training.infrastructure.SessionEnrollmentRepository;
import fr.adriencaubel.trainingplan.training.infrastructure.SessionRepository;
import fr.adriencaubel.trainingplan.training.infrastructure.specifciation.FeedbackSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private final SessionRepository sessionRepository;

    private final SessionEnrollmentRepository sessionEnrollmentRepository;
    private final FeedbackRepository feedbackRepository;

    public Page<Feedback> getFeedbacksBy(Long trainingId, Long sessionId, Pageable pageable) {
        Specification<Feedback> specification = FeedbackSpecification.filter(trainingId, sessionId);
        return feedbackRepository.findAll(specification, pageable);
    }

    @Transactional
    public void giveFeedback(String feedbackToken, FeedbackRequestModel feedbackRequestModel) {
        SessionEnrollment sessionEnrollment = sessionEnrollmentRepository.findByFeedbackToken(feedbackToken).orElseThrow(() -> new DomainException("Invalid feedback token"));

        sessionEnrollment.addFeedback(feedbackRequestModel.getComment(), feedbackRequestModel.getRating());

        sessionEnrollmentRepository.save(sessionEnrollment);
    }
}
