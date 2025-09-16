package fr.adriencaubel.trainingplan.espaceetudiant;

import fr.adriencaubel.trainingplan.employee.domain.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Table
@Entity
public class EspaceEtudiantAccessLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Employee employee;

    private String accessToken;

    private LocalDateTime creationDate;

    private LocalDateTime expirationDate;

    private LocalDateTime usedAtDate;

    public EspaceEtudiantAccessLink(Employee employee) {
        this.employee = employee;
        this.creationDate = LocalDateTime.now();
        this.expirationDate = LocalDateTime.now().plusDays(1);
        this.usedAtDate = LocalDateTime.now();
        this.accessToken = UUID.randomUUID().toString();
    }

    public EspaceEtudiantAccessLink() {

    }
}
