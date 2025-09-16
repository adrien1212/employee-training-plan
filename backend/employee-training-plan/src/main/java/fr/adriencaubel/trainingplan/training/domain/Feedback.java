package fr.adriencaubel.trainingplan.training.domain;


import fr.adriencaubel.trainingplan.company.domain.model.Company;
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

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Company company;

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

    public static Feedback create(Company company) {
        Feedback feedback = new Feedback();
        feedback.setCompany(company);
        return feedback;
    }

    // c'est calculée via la date de fin (comme ca si elle change on n'a pas besoin d'update la fin du token)
    public boolean isTokenExpired() {
        // Le token prend fin a endDate+7
        return LocalDate.now().isAfter(sessionEnrollment.getSession().getEndDate().plusDays(7));
    }
}