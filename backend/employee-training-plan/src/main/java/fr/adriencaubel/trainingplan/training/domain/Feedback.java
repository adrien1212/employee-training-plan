package fr.adriencaubel.trainingplan.training.domain;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Entity
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating;
    private String comment;
    private LocalDate createdAt = LocalDate.now();

    public Feedback() {
    }

    public Feedback(int rating, String comment) {
        this.rating = rating;
        this.comment = comment;
    }
}