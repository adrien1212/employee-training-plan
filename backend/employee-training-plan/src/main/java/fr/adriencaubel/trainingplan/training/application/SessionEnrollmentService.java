package fr.adriencaubel.trainingplan.training.application;

import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import fr.adriencaubel.trainingplan.training.infrastructure.SessionEnrollmentRepository;
import fr.adriencaubel.trainingplan.training.infrastructure.specifciation.SessionEnrollmentSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionEnrollmentService {
    private final SessionEnrollmentRepository sessionEnrollmentRepository;

    public List<SessionEnrollment> findAllByTrainingIdOrEmployeeId(Long trainingId, Long employeeId, SessionStatus sessionStatus) {
        Specification<SessionEnrollment> specification = SessionEnrollmentSpecification.filter(trainingId, employeeId, sessionStatus, null, null);
        return sessionEnrollmentRepository.findAll(specification);
    }

    public List<SessionEnrollment> findAllByEmployeeIdAndSessionDate(Long employeeId, LocalDate startDate, LocalDate endDate) {
        Specification<SessionEnrollment> specification = SessionEnrollmentSpecification.filter(null, employeeId, null, startDate, endDate);
        return sessionEnrollmentRepository.findAll(specification);
    }

    public List<SessionEnrollment> findAllByTrainingIdAndSessionDate(Long trainingId, LocalDate startDate, LocalDate endDate) {
        Specification<SessionEnrollment> specification = SessionEnrollmentSpecification.filter(trainingId, null, null, startDate, endDate);
        return sessionEnrollmentRepository.findAll(specification);
    }
}
