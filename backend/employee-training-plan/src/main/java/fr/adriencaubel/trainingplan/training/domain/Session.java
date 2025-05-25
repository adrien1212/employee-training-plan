package fr.adriencaubel.trainingplan.training.domain;

import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Getter
@Setter
@Entity
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate startDate;

    private LocalDate endDate;

    private SessionStatus status = SessionStatus.NOT_STARTED;

    private String accessToken;

    private LocalDateTime accessTokenExpiresAt;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<SessionEnrollment> sessionEnrollments;

    @ManyToOne
    @JoinColumn(name = "training_id")
    private Training training;

    public SessionEnrollment enrollEmployee(Employee employee) {
        if (!status.equals(SessionStatus.NOT_STARTED)) {
            throw new DomainException("Cannot enroll in a " + status + " session");
        }

        // Check if already enrolled
        boolean alreadyEnrolled = sessionEnrollments.stream()
                .anyMatch(enrollment -> enrollment.getEmployee().getId().equals(employee.getId()));

        if (alreadyEnrolled) {
            throw new DomainException("Employee is already enrolled in this session");
        }

        SessionEnrollment enrollment = new SessionEnrollment(employee, this);
        sessionEnrollments.add(enrollment);
        return enrollment;
    }

    public void cancelEnrollment(Employee employee) {
        if (!status.equals(SessionStatus.NOT_STARTED)) {
            throw new DomainException("Cannot cancel enrollment in a " + status + " session");
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

    public void complete(String accessToken) {
        if (status != SessionStatus.ACTIVE) {
            throw new IllegalArgumentException("Can only complete active trainings");
        }

        if (!this.accessToken.equals(accessToken)) {
            throw new DomainException("Wrong session token");
        }

        sessionEnrollments.forEach(SessionEnrollment::openFeedback);
        this.status = SessionStatus.COMPLETED;

        // Envoyer un mail a chacun des participants +
    }

    public boolean isSessionComplete() {
        return status == SessionStatus.COMPLETED;
    }

    public List<Feedback> getFeedbacks() {
        if (!this.isSessionComplete()) {
            throw new DomainException("Session is not complete.");
        }
        return sessionEnrollments.stream()
                .map(SessionEnrollment::getFeedback)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public BigDecimal calculateRatingAverage() {
        int sumOfRating = 0;
        int votersCount = 0;

        for (SessionEnrollment enrollment : sessionEnrollments) {
            Feedback feedback = enrollment.getFeedback();
            if (feedback != null && feedback.getRating() != 0) {
                sumOfRating += feedback.getRating();
                votersCount++;
            }
        }

        if (votersCount == 0) {
            return BigDecimal.ZERO; // Avoid division by zero
        }

        return BigDecimal.valueOf(sumOfRating)
                .divide(BigDecimal.valueOf(votersCount), 2, RoundingMode.HALF_UP);
    }

    public int getSessionDuration() {
        Period period = Period.between(this.startDate, this.endDate);
        return Math.abs(period.getDays());
    }
}
