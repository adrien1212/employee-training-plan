package fr.adriencaubel.trainingplan.training.application;

import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import fr.adriencaubel.trainingplan.training.infrastructure.SessionEnrollmentRepository;
import fr.adriencaubel.trainingplan.training.infrastructure.specifciation.SessionEnrollmentSpecification;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionEnrollmentService {
    private final SessionEnrollmentRepository sessionEnrollmentRepository;

    public Page<SessionEnrollment> findAllByTrainingIdOrEmployeeId(Long trainingId, Long employeeId, Long sessionId, SessionStatus sessionStatus, Boolean isFeedbackGiven, Pageable pageable) {
        Specification<SessionEnrollment> specification = SessionEnrollmentSpecification.filter(trainingId, employeeId, sessionId, sessionStatus, isFeedbackGiven, null, null);
        return sessionEnrollmentRepository.findAll(specification, pageable);
    }

    public List<SessionEnrollment> findAllByEmployeeIdAndSessionDate(Long employeeId, LocalDate startDate, LocalDate endDate) {
        Specification<SessionEnrollment> specification = SessionEnrollmentSpecification.filter(null, employeeId, null, null, null, startDate, endDate);
        return sessionEnrollmentRepository.findAll(specification);
    }

    public SessionEnrollment findByAccessToken(String accessToken) {
        return sessionEnrollmentRepository.findByAccessToken(accessToken).orElseThrow();
    }

    public SessionEnrollment validateToken(String token) {
        if (token == null || token.isBlank()) {
            throw new DomainException("Token must not be blank");
        }


        SessionEnrollment enroll = sessionEnrollmentRepository.findByFeedbackToken(token)
                .orElseThrow(() -> new DomainException("Invalid feedback token"));

        if (enroll.getFeedback().getComment() != null) {
            throw new DomainException("Vous avez déjà donné votre avis");
        }

        if (enroll.getFeedback().isTokenExpired()) {
            throw new DomainException("Token has expired");
        }

        if (!SessionStatus.COMPLETED.equals(enroll.getSession().getLastStatus())) {
            throw new DomainException("Session is not complete");
        }

        return enroll;
    }

    public SessionEnrollment findById(Long id) {
        return sessionEnrollmentRepository.findById(id).orElseThrow(() -> new NotFoundException("SessionEnrollment Invalid id"));
    }

    public String getFeedbackToken(Long sessionEnrollmentId) {
        SessionEnrollment sessionEnrollment = findById(sessionEnrollmentId);
        return sessionEnrollment.getFeedback().getFeedbackToken();
    }
}
