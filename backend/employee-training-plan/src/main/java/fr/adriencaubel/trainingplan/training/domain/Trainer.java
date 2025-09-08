package fr.adriencaubel.trainingplan.training.domain;

import fr.adriencaubel.trainingplan.company.domain.model.Company;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table
public class Trainer implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Company company;

    private String firstName;
    private String lastName;
    private String email;
    private String speciality;

    @OneToMany(mappedBy = "trainer")
    private List<Session> session = new ArrayList<>();

    public void addSession(Session session) {
        this.session.add(session);
        session.setTrainer(this);
    }
}
