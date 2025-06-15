package fr.adriencaubel.trainingplan.signature.domain;

import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table
public class Signature implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String signature;

    private LocalDateTime signatureDate;

    @ManyToOne
    private SessionEnrollment sessionEnrollment;

    @ManyToOne
    private SlotSignature slotSignature;

    public Signature() {
    }

    public Signature(SlotSignature slotSignature, SessionEnrollment sessionEnrollment, String signature) {
        this.signature = signature;
        this.slotSignature = slotSignature;
        this.sessionEnrollment = sessionEnrollment;
        this.signatureDate = LocalDateTime.now();
    }
}
