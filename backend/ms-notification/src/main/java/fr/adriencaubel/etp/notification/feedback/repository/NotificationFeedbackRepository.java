package fr.adriencaubel.etp.notification.feedback.repository;

import fr.adriencaubel.etp.notification.feedback.domain.NotificationFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationFeedbackRepository extends JpaRepository<NotificationFeedback, Long> {
}
