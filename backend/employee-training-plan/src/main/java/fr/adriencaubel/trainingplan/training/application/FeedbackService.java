package fr.adriencaubel.trainingplan.training.application;

import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.training.application.dto.FeedbackRequestModel;
import fr.adriencaubel.trainingplan.training.domain.Feedback;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import fr.adriencaubel.trainingplan.training.domain.event.SessionCompletedEvent;
import fr.adriencaubel.trainingplan.training.infrastructure.FeedbackRepository;
import fr.adriencaubel.trainingplan.training.infrastructure.SessionEnrollmentRepository;
import fr.adriencaubel.trainingplan.training.infrastructure.adapter.RabbitMQNotificationAdapter;
import fr.adriencaubel.trainingplan.training.infrastructure.specifciation.FeedbackSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private final SessionEnrollmentRepository sessionEnrollmentRepository;
    private final FeedbackRepository feedbackRepository;

    private final RabbitMQNotificationAdapter rabbitMQNotificationAdapter;

    public Feedback findById(Long id) {
        return feedbackRepository.findById(id).orElseThrow(() -> new DomainException("Feedback not found"));
    }

    public Page<Feedback> findAll(Long trainingId, Long sessionId, Pageable pageable) {
        Specification<Feedback> specification = FeedbackSpecification.filter(trainingId, sessionId);
        return feedbackRepository.findAll(specification, pageable);
    }

    @Transactional
    public void giveFeedback(FeedbackRequestModel feedbackRequestModel) {
        SessionEnrollment sessionEnrollment = sessionEnrollmentRepository.findByFeedbackToken(feedbackRequestModel.getAccessToken()).orElseThrow(() -> new DomainException("Invalid feedback token"));

        sessionEnrollment.addFeedback(feedbackRequestModel.getComment(), feedbackRequestModel.getRating());

        sessionEnrollmentRepository.save(sessionEnrollment);
    }

    @EventListener
    public void handleSessionCompleted(SessionCompletedEvent event) {
        List<SessionEnrollment> enrollments = event.getSessionEnrollments();

        for (SessionEnrollment enrollment : enrollments) {
            rabbitMQNotificationAdapter.sendSessionCompletedNotification(enrollment);
        }
    }

    public void relanceDemandeFeedback(Long id) {
        Feedback feedback = findById(id);
        if (!feedback.isTokenExpired()) {
            throw new DomainException("Feedback token expired");
        }
        if (feedback.getRating() != 0) {
            throw new DomainException("Feedback rating already done");
        }

        rabbitMQNotificationAdapter.sendRelanceDemandeFeedbackNotification(feedback);
    }
}
