package fr.adriencaubel.trainingplan.training.domain;


import fr.adriencaubel.trainingplan.common.exception.DomainException;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long companyId;

    private int rating;
    private String comment;
    private LocalDate createdAt;

    @OneToOne
    private SessionEnrollment sessionEnrollment;

    public Feedback() {
    }

    @Deprecated
    public Feedback(int rating, String comment) {
        this.rating = rating;
        this.comment = comment;
        this.createdAt = LocalDate.now();
    }

    public static Feedback create(String comment, int rating, Long companyId, SessionEnrollment sessionEnrollment) {
        if (comment == null || comment.isBlank()) throw new DomainException("Comment is required");

        if (rating < 0 || rating > 5) throw new DomainException("Rating must be between 0 and 5");

        Feedback feedback = new Feedback(rating, comment);
        feedback.setCompanyId(companyId);
        feedback.setComment(comment);
        feedback.setRating(rating);
        feedback.setSessionEnrollment(sessionEnrollment);
        return feedback;
    }
}