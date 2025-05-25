package fr.adriencaubel.trainingplan.training.application;

import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.training.domain.Feedback;
import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import fr.adriencaubel.trainingplan.training.infrastructure.SessionEnrollmentRepository;
import fr.adriencaubel.trainingplan.training.infrastructure.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private final SessionEnrollmentRepository sessionEnrollmentRepository;

    private final SessionRepository sessionRepository;

    public List<Feedback> getFeedbacksBySessionId(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session " + sessionId + " not found"));

        return session.getFeedbacks();
    }
}
