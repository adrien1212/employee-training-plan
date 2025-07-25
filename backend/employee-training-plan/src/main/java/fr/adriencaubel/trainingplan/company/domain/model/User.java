package fr.adriencaubel.trainingplan.company.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
// Owner
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String sub;

    @Enumerated(EnumType.STRING)
    private Role role;

    @ManyToOne(cascade = CascadeType.ALL)
    private Company company;

    public User() {

    }

    public User(String sub) {
        this.sub = sub;
    }

    public enum Role {
        OWNER,
        STAFF_MEMBER
    }
}
