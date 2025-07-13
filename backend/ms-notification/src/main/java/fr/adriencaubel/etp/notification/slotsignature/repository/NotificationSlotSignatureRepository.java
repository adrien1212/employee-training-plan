package fr.adriencaubel.etp.notification.slotsignature.repository;

import fr.adriencaubel.etp.notification.slotsignature.domain.NotificationSlotSignature;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationSlotSignatureRepository extends JpaRepository<NotificationSlotSignature, Long> {
}
