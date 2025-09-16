package fr.adriencaubel.trainingplan.training.domain;

import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.signature.domain.Signature;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
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

    @OneToOne(mappedBy = "sessionEnrollment", cascade = CascadeType.ALL, optional = true)
    private Feedback feedback;

    @OneToMany(mappedBy = "sessionEnrollment", cascade = CascadeType.ALL)
    private List<Signature> signatures = new ArrayList<>();

    private String accessToken;

    public SessionEnrollment() {
    }

    public SessionEnrollment(Employee employee, Session session) {
        this.employee = employee;
        this.session = session;
        this.accessToken = UUID.randomUUID().toString();
        //this.feedback = Feedback.create(session.getTraining().getCompany());
        //feedback.setSessionEnrollment(this);
    }

    public void openFeedback() {
        this.feedback = Feedback.create(session.getTraining().getCompany());
        feedback.setSessionEnrollment(this);
    }

    public void addFeedback(String comment, int rating) {
        if (this.getFeedback() != null) throw new DomainException("Feedback already enrolled");

        if (comment == null || comment.isBlank()) throw new DomainException("Comment is required");

        if (rating < 0 || rating > 5) throw new DomainException("Rating must be between 0 and 5");

        if (!session.isSessionComplete()) {
            throw new DomainException("Session not completed");
        }

        Feedback feedback = new Feedback(rating, comment);
        feedback.setCompany(session.getTraining().getCompany());
        feedback.setComment(comment);
        feedback.setRating(rating);
        feedback.setSessionEnrollment(this);
        this.feedback = feedback;
    }
}