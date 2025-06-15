package fr.adriencaubel.trainingplan.training.application;

import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.company.application.service.UserService;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.employee.infrastructure.EmployeeRepository;
import fr.adriencaubel.trainingplan.signature.application.SlotManagementService;
import fr.adriencaubel.trainingplan.training.application.dto.CreateSessionRequestModel;
import fr.adriencaubel.trainingplan.training.application.dto.UpdateSessionRequestModel;
import fr.adriencaubel.trainingplan.training.domain.*;
import fr.adriencaubel.trainingplan.training.domain.event.EmployeeSubscribedEvent;
import fr.adriencaubel.trainingplan.training.domain.event.SessionCompletedEvent;
import fr.adriencaubel.trainingplan.training.infrastructure.SessionEnrollmentRepository;
import fr.adriencaubel.trainingplan.training.infrastructure.SessionRepository;
import fr.adriencaubel.trainingplan.training.infrastructure.specifciation.SessionSpecification;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SlotManagementService slotManagementService;
    private final SessionRepository sessionRepository;
    private final SessionEnrollmentRepository sessionEnrollmentRepository;
    private final TrainingService trainingService;
    private final EmployeeRepository employeeRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final NotificationPort notificationPort;
    private final UserService userService;
    private final TrainerService trainerService;

    @Transactional
    public Session createSession(Long trainingId, CreateSessionRequestModel createSessionRequestModel) {
        Training training = trainingService.getTrainingById(trainingId);
        Trainer trainer = trainerService.getTrainerById(createSessionRequestModel.getTrainerId());
        return training.createSession(createSessionRequestModel.getStartDate(), createSessionRequestModel.getEndDate(), createSessionRequestModel.getLocation(), trainer);
    }

    @Transactional
    public Session completeSession(String accessToken) {
        // Fetch training with proper error handling
        Session session = sessionRepository.findByTrainerAccessTokenWithSessionEnrollmentAndSlotSignatures(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("Session not found with access token: " + accessToken));

        // Check if training can be completed
        session.complete();

        // Save the aggregate root
        session = sessionRepository.save(session);

        // Fetch all enrolled employees
        List<SessionEnrollment> sessionEnrollments = sessionEnrollmentRepository
                .findBySession(session);

        // Publish domain event for training completion
        eventPublisher.publishEvent(new SessionCompletedEvent(session, sessionEnrollments));
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

        Session toReturn = sessionRepository.saveAndFlush(session);

        SessionEnrollment persisted = toReturn.getSessionEnrollments().stream()
                .filter(e -> e.getEmployee().getId().equals(employeeId))
                .filter(e -> e.getId() != null)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Enrollment wasn’t saved"));

        // Publish domain event for email notification
        eventPublisher.publishEvent(new EmployeeSubscribedEvent(persisted));

        return toReturn;
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

    public Page<Session> getSessions(Long trainingId, Long trainerId, SessionStatus sessionStatus, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        Specification<Session> specification = SessionSpecification.filter(trainingId, trainerId, sessionStatus, startDate, endDate);
        return sessionRepository.findAll(specification, pageable);
    }

    public Session findByTrainerAccessToken(@NotNull String trainerAccessToken) {
        return sessionRepository.findByTrainerAccessToken(trainerAccessToken).orElseThrow(() -> new EntityNotFoundException("Session not found with access token: " + trainerAccessToken));
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleEmployeeSubscribedEvent(EmployeeSubscribedEvent event) {
        notificationPort.sendSubscribeNotification(event.getSessionEnrollment());
    }

    @EventListener
    public void handleSessionCompletedEvent(SessionCompletedEvent event) {
        // Envoyer un mail à tous les participants
        /*for (SessionEnrollment enrollment : event.getSessionEnrollments()) {
            emailNotificationPort.sendFeedbackEmail(
                    enrollment.getEmployee(),
                    enrollment.getSession(),
                    enrollment.getFeedback().getFeedbackToken()
            );
        }*/
    }

    public List<Session> getSessionByMonth(int month, int year) {
        LocalDate start = YearMonth.of(year, month).atDay(1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return sessionRepository.findAllByDate(start, end);
    }

    public List<Session> findAllByTrainingIdAndSessionDate(Long trainingId, LocalDate startDate, LocalDate endDate) {
        Specification<Session> specification = SessionSpecification.filter(trainingId, null, null, startDate, endDate);
        return sessionRepository.findAll(specification);
    }

    public List<Session> findAllByTrainingIdWithEnrollments(Long trainingId, LocalDate startDate, LocalDate endDate) {
        return sessionRepository.findAllByTrainingIdWithEnrollments(trainingId, startDate, endDate);
    }

    public Session findBySessionIdWithEnrollments(Long sessionId) {
        return sessionRepository.findByIdWithSessionEnrollment(sessionId).orElseThrow(() -> new IllegalArgumentException("Session " + sessionId + " not found"));
    }

    public Session getSessionById(Long id) {
        return sessionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Session " + id + " not found"));
    }

    @Transactional
    public Session updateStatus(Long sessionId, SessionStatus newSessionStatus) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new DomainException("Session not found: " + sessionId));

        SessionStatus current = session.getLastStatus();
        // If the newStatus is the same as current, you can choose to treat it as no-op:
        if (current == newSessionStatus) {
            return session;
        }

        // Check allowed transitions:
        session.changeStatus(newSessionStatus);

        if (newSessionStatus == SessionStatus.ACTIVE) {
            slotManagementService.createSlotsFor(session);
        }

        return sessionRepository.save(session);
    }

    public int count() {
        Company company = userService.getCompanyOfAuthenticatedUser();

        return (int) sessionRepository.countByCompany(company);
    }

    @Transactional
    public Session updateSession(Long id, UpdateSessionRequestModel updateSessionRequestModel) {
        Session session = getSessionById(id);

        if (session.getLastStatus() == SessionStatus.COMPLETED) {
            throw new DomainException("Impossible to update session completed");
        }

        if (updateSessionRequestModel.getStartDate() != null) {
            session.setStartDate(updateSessionRequestModel.getStartDate());
        }
        if (updateSessionRequestModel.getEndDate() != null) {
            session.setEndDate(updateSessionRequestModel.getEndDate());
        }
        if (updateSessionRequestModel.getLocation() != null) {
            session.setLocation(updateSessionRequestModel.getLocation());
        }
        if (updateSessionRequestModel.getStatus() != null) {
            updateStatus(id, updateSessionRequestModel.getStatus());
        }

        return sessionRepository.save(session);
    }

    @Transactional
    public void deleteSession(Long id) {
        Session session = getSessionById(id);

        if (session.getLastStatus() == SessionStatus.COMPLETED) {
            throw new DomainException("Impossible to delete session completed");
        }
        session.changeStatus(SessionStatus.CANCELLED);
        sessionRepository.save(session);
    }

    public Session getSessionByAccessToken(String accessToken) {
        Session session = sessionRepository.findByTrainerAccessTokenWithSessionEnrollmentAndSlotSignatures(accessToken).orElseThrow(() -> new DomainException("Session not found: " + accessToken));
        return session;
    }

}
