package fr.adriencaubel.trainingplan.signature.infrastructure;

import fr.adriencaubel.trainingplan.signature.domain.Signature;
import fr.adriencaubel.trainingplan.signature.domain.SlotSignature;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SignatureRepository extends JpaRepository<Signature, Long>, JpaSpecificationExecutor<Signature> {
    List<Signature> findBySessionEnrollmentId(Long enrollmentId);

    @Query("""
                SELECT s
                FROM Signature s
                LEFT JOIN FETCH s.slotSignature slotSignature
                LEFT JOIN FETCH slotSignature.session ss
                WHERE ss.id = :sessionId
            """)
    List<Signature> findBySlotSignature_Session_Id(Long sessionId);

    boolean existsBySlotSignatureAndSessionEnrollment(SlotSignature slotSignature, SessionEnrollment enrollment);
}
