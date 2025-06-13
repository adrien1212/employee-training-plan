package fr.adriencaubel.trainingplan.training.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table
public class SessionStatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Session session;

    @Enumerated(EnumType.STRING)
    private SessionStatus status;

    private LocalDateTime changedAt;

    private String updateBy;
}
