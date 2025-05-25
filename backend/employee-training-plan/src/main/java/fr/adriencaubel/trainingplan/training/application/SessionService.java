package fr.adriencaubel.trainingplan.training.application;

import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.employee.infrastructure.EmployeeRepository;
import fr.adriencaubel.trainingplan.training.application.dto.CreateSessionRequestModel;
import fr.adriencaubel.trainingplan.training.application.dto.FeedbackRequestModel;
import fr.adriencaubel.trainingplan.training.domain.*;
import fr.adriencaubel.trainingplan.training.domain.event.EmployeeSubscribedEvent;
import fr.adriencaubel.trainingplan.training.domain.event.SessionCompletedEvent;
import fr.adriencaubel.trainingplan.training.infrastructure.SessionEnrollmentRepository;
import fr.adriencaubel.trainingplan.training.infrastructure.SessionRepository;
import fr.adriencaubel.trainingplan.training.infrastructure.specifciation.SessionSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;

    private final SessionEnrollmentRepository sessionEnrollmentRepository;

    private final TrainingService trainingService;

    private final EmployeeRepository employeeRepository;

    private final ApplicationEventPublisher eventPublisher;

    private final EmailNotificationPort emailNotificationPort;

    @Transactional
    public Session createSession(CreateSessionRequestModel createSessionRequestModel, Long trainingId) {
        Training training = trainingService.getTrainingById(trainingId);
        return training.createSession(createSessionRequestModel.getStartDate(), createSessionRequestModel.getEndDate());
    }

    @Transactional
    public Session completeTraining(Long sessionId, String accessToken) {
        // Fetch training with proper error handling
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Session not found with id: " + sessionId));

        // Check if training can be completed
        session.complete(accessToken);

        // Save the aggregate root
        session = sessionRepository.save(session);

        // Fetch all enrolled employees
        List<Employee> enrolledEmployees = sessionEnrollmentRepository
                .findBySession(session).stream().map(SessionEnrollment::getEmployee).collect(Collectors.toList());

        // Publish domain event for training completion
        eventPublisher.publishEvent(new SessionCompletedEvent(session, enrolledEmployees));
        return session;
    }

    @Transactional
    public Session subscribeEmployeeToSession(Long sessionId, Long employeeId) {
        // Fetch entities with proper error handling
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + employeeId));

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Session not found with id: " + sessionId));

        session.enrollEmployee(employee);

        // Publish domain event for email notification
        eventPublisher.publishEvent(new EmployeeSubscribedEvent(session, employee));

        return sessionRepository.save(session);
    }

    @Transactional
    public void unsubscribeEmployeeToSession(Long sessionId, Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + employeeId));

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Session not found with id: " + sessionId));

        session.cancelEnrollment(employee);

        sessionRepository.save(session);
    }

    public List<Session> getSessionsForTraining(Long trainingId, SessionStatus sessionStatus) {
        Specification<Session> specification = SessionSpecification.filter(trainingId, sessionStatus, null, null);
        return sessionRepository.findAll(specification);
    }

    @Transactional
    public void giveFeedback(String feedbackToken, FeedbackRequestModel feedbackRequestModel) {
        SessionEnrollment sessionEnrollment = sessionEnrollmentRepository.findByFeedbackToken(feedbackToken).orElseThrow(() -> new DomainException("Invalid feedback token"));

        Feedback feedback = new Feedback(feedbackRequestModel.getRating(), feedbackRequestModel.getComment());
        sessionEnrollment.addFeedback(feedback);

        sessionEnrollmentRepository.save(sessionEnrollment);
    }

    public List<SessionEnrollment> getSessionEnrollmentBySessionId(Long sessionId) {
        return sessionEnrollmentRepository.findBySessionId(sessionId);
    }

    @EventListener
    public void handleEmployeeSubscribedEvent(EmployeeSubscribedEvent event) {
        emailNotificationPort.sendTrainingSubscriptionEmail(
                event.getEmployee(),
                event.getSession()
        );
    }
    
    public List<Feedback> getFeedbacksBySessionId(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session " + sessionId + " not found"));

        return session.getFeedbacks();
    }

    public List<Session> getSessionByMonth(int month, int year) {
        LocalDate start = YearMonth.of(year, month).atDay(1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return sessionRepository.findAllByDate(start, end);
    }

    public List<Session> findAllByTrainingIdAndSessionDate(Long trainingId, LocalDate startDate, LocalDate endDate) {
        Specification<Session> specification = SessionSpecification.filter(trainingId, null, startDate, endDate);
        return sessionRepository.findAll(specification);
    }

    public List<Session> findAllByTrainingIdWithEnrollments(Long trainingId, LocalDate startDate, LocalDate endDate) {
        return sessionRepository.findAllByTrainingIdWithEnrollments(trainingId, startDate, endDate);
    }
}
