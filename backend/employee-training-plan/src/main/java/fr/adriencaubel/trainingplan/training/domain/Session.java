package fr.adriencaubel.trainingplan.training.domain;

import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.signature.domain.ModeSignature;
import fr.adriencaubel.trainingplan.signature.domain.SlotSignature;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Company company;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("changedAt DESC")
    private List<SessionStatusHistory> sessionStatusHistories = new ArrayList<>();
    private String trainerAccessToken;
    private String employeeAccessToken;
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private Set<SessionEnrollment> sessionEnrollments;
    @ManyToOne
    @JoinColumn(name = "training_id")
    private Training training;
    @Enumerated(EnumType.STRING)
    private ModeSignature modeSignature;
    @ManyToOne(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.PERSIST, CascadeType.MERGE}
    )
    private Trainer trainer;

    @OneToMany(mappedBy = "session")
    // because multiple bag with sessioNEnrollment when findByTrainerAccessTokenWithSessionEnrollmentAndSlotSignatures
    private Set<SlotSignature> slotSignatures;

    @Transient
    public SessionStatusHistory getLastStatusHistory() {
        return sessionStatusHistories.isEmpty()
                ? null
                : sessionStatusHistories.get(0);
    }

    @Transient
    public SessionStatus getLastStatus() {
        SessionStatusHistory last = getLastStatusHistory();
        return last != null
                ? last.getStatus()
                : null;
    }

    public void enrollEmployee(Employee employee) {
        if (!SessionStatus.NOT_STARTED.equals(getLastStatus())) {
            throw new DomainException("Cannot enroll in a " + getLastStatus() + " session");
        }

        // Check if already enrolled
        boolean alreadyEnrolled = sessionEnrollments.stream()
                .anyMatch(enrollment -> enrollment.getEmployee().getId().equals(employee.getId()));

        if (alreadyEnrolled) {
            throw new DomainException("Employee is already enrolled in this session");
        }

        SessionEnrollment enrollment = new SessionEnrollment(employee, this);
        sessionEnrollments.add(enrollment);
    }

    public void cancelEnrollment(Employee employee) {
        if (!SessionStatus.NOT_STARTED.equals(getLastStatus())) {
            throw new DomainException("Cannot cancel enrollment in a " + getLastStatus() + " session");
        }

        SessionEnrollment enrollmentToRemove = sessionEnrollments.stream()
                .filter(enrollment -> enrollment.getEmployee().getId().equals(employee.getId()))
                .findFirst()
                .orElse(null);

        if (enrollmentToRemove != null) {
            sessionEnrollments.remove(enrollmentToRemove);
            employee.getSessionEnrollments().remove(enrollmentToRemove);
        } else {
            throw new DomainException("Employee is not enrolled in this session");
        }
    }

    public void complete() {
        if (getLastStatus() != SessionStatus.ACTIVE) {
            throw new IllegalArgumentException("Can only complete active trainings");
        }
        changeStatus(SessionStatus.COMPLETED);
    }

    public void open() {
        if (getLastStatus() != SessionStatus.NOT_STARTED) {
            throw new IllegalArgumentException("Can only open not started trainings");
        }

        sessionEnrollments.forEach(SessionEnrollment::openFeedback);
        changeStatus(SessionStatus.ACTIVE);
    }

    public boolean isSessionComplete() {
        return getLastStatus() == SessionStatus.COMPLETED;
    }

    public void changeStatus(SessionStatus target) {
        if (this.getLastStatus() == null) {
            // TODO si on crée une session
        } else {
            if (this.getLastStatus() == target) {
                throw new DomainException("This status is already set to " + target);
            }

            if (!SessionStatus.canTransitionTo(this.getLastStatus(), target)) {
                throw new IllegalStateException(
                        "Cannot change status from " + this.getLastStatus() + " to " + target);
            }
        }
        SessionStatusHistory sessionStatusHistory = new SessionStatusHistory();
        sessionStatusHistory.setStatus(target);
        sessionStatusHistory.setSession(this);
        sessionStatusHistory.setChangedAt(LocalDateTime.now());
        sessionStatusHistory.setUpdateBy("toto");
        sessionStatusHistories.add(sessionStatusHistory);
    }

    public int getSessionDuration() {
        Period period = Period.between(this.startDate, this.endDate);
        return Math.abs(period.getDays());
    }
}
