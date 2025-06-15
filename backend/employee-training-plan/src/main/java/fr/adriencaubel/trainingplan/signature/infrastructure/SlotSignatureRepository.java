package fr.adriencaubel.trainingplan.signature.infrastructure;

import fr.adriencaubel.trainingplan.signature.domain.SlotSignature;
import fr.adriencaubel.trainingplan.signature.domain.SlotSignatureStatus;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SlotSignatureRepository extends JpaRepository<SlotSignature, Long> {
    SlotSignature findByTokenAndSlotSignatureStatus(@NotNull String slotToken, SlotSignatureStatus slotSignatureStatus);

    Page<SlotSignature> findBySessionId(Long sessionId, Pageable pageable);

    Optional<SlotSignature> findByToken(String slotAccessToken);
}
