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

    public void signBy(SessionEnrollment enrollment, String signatureValue) throws DomainException {
        if (this.getSlotSignatureStatus() != SlotSignatureStatus.OPEN || (this.getExpiresAt() != null && this.getExpiresAt().isBefore(LocalDateTime.now()))) {
            throw new DomainException("Le créneau est fermé ou expiré");
        }

        // 3) Vérifier l'appartenance de la session
        if (!enrollment.getSession().getId().equals(this.getSession().getId())) {
            throw new DomainException("Token non valide pour cette session");
        }
        // 4) Contrôle de doublon
        boolean alreadySigned = this.getSignatures().stream()
                .anyMatch(sig -> sig.getSessionEnrollment().getId().equals(enrollment.getId()));
        if (alreadySigned) {
            throw new DomainException("Déjà signé pour ce créneau");
        }

        signatures.add(new Signature(this, enrollment, signatureValue));
    }

    public void ouvrirSignature() {
        if (this.slotSignatureStatus == SlotSignatureStatus.OPEN) {
            throw new DomainException("Slot signature already open");
        }
        this.slotSignatureStatus = SlotSignatureStatus.OPEN;
    }

    public void fermerSignature() {
        if (this.slotSignatureStatus == SlotSignatureStatus.COMPLETED) {
            throw new DomainException("Slot signature already closed");
        }

        if (this.slotSignatureStatus != SlotSignatureStatus.OPEN) {
            throw new DomainException("Slot must be open before closed");
        }
        this.slotSignatureStatus = SlotSignatureStatus.COMPLETED;
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
