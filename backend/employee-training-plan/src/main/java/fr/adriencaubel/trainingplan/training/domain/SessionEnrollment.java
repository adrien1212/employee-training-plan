package fr.adriencaubel.trainingplan.training.domain;

import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
public class SessionEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private Session session;

    private boolean completed = false;

    @OneToOne(cascade = CascadeType.ALL)
    private Feedback feedback;

    private String feedbackToken;

    private LocalDateTime tokenExpiration;

    public SessionEnrollment() {}

    public SessionEnrollment(Employee employee, Session session) {
        this.employee = employee;
        this.session = session;
    }

    public void openFeedback() {
        feedbackToken = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 20);
        tokenExpiration = LocalDateTime.now().plusDays(7);
    }

    public void addFeedback(Feedback feedback) {
        if(this.getFeedback() != null) throw new DomainException("Feedback already enrolled");

        this.feedback = feedback;
    }
}