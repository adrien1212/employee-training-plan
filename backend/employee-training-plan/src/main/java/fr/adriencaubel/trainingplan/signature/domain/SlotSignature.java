package fr.adriencaubel.trainingplan.signature.domain;

import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;


@Getter
@Setter
@Entity
public class SlotSignature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Session session;

    private LocalDate dateCreneau;

    @Enumerated(EnumType.STRING)
    private Periode periode;

    @OneToMany(mappedBy = "slotSignature", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Signature> signatures;

    private String token;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    @Enumerated(EnumType.STRING)
    private SlotSignatureStatus slotSignatureStatus;

    public SlotSignature(Session session, LocalDate start, Periode periode) {
        this.session = session;
        this.dateCreneau = start;
        this.periode = periode;
        this.slotSignatureStatus = SlotSignatureStatus.NOT_STARTED;
        this.token = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
    }

    public SlotSignature() {

    }

    public void sign(String signature, SessionEnrollment sessionEnrollment) throws DomainException {
        if (slotSignatureStatus == SlotSignatureStatus.NOT_STARTED || slotSignatureStatus == SlotSignatureStatus.COMPLETED || expiresAt.isBefore(LocalDateTime.now())) {
            throw new DomainException("This slot is closed");
        }

        if (signature == null || signature.isEmpty()) {
            throw new DomainException("Signature cannot be null or empty");
        }

        if (sessionEnrollment == null) {
            throw new DomainException("SessionEnrollment cannot be null");
        }

        if (signatures.stream().anyMatch(s -> s.getSessionEnrollment().equals(sessionEnrollment))) {
            throw new DomainException("Already signed this slot");
        }

        if (sessionEnrollment.getSession().getId() != this.session.getId()) {
            throw new DomainException("SessionEnrollment cannot loinger to this session");
        }

        Signature signatureEntity = new Signature();
        signatureEntity.setSignature(signature);
        signatureEntity.setSessionEnrollment(sessionEnrollment);
        signatureEntity.setSignatureDate(LocalDateTime.now());
        signatureEntity.setSlotSignature(this);
        this.signatures.add(signatureEntity);
        sessionEnrollment.getSignatures().add(signatureEntity);
    }

    public void ouvrirSignature() {
        if (this.slotSignatureStatus == SlotSignatureStatus.OPEN) {
            throw new DomainException("Slot signature already open");
        }
        this.slotSignatureStatus = SlotSignatureStatus.OPEN;
    }

    public void completeSignature() {
        if (this.slotSignatureStatus != SlotSignatureStatus.OPEN) {
            throw new DomainException("Slot signature already not open");
        }
        this.slotSignatureStatus = SlotSignatureStatus.COMPLETED;
    }

    public static enum Periode {
        GLOBAL, JOUR, MATIN, APRESMIDI
    }
}
