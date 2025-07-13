package fr.adriencaubel.etp.notification.parameters.repository;


import fr.adriencaubel.etp.notification.parameters.domain.NotificationParameter;
import fr.adriencaubel.etp.notification.parameters.domain.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationParameterRepository extends JpaRepository<NotificationParameter, Long> {
    List<NotificationParameter> findAllByNotificationType(NotificationType notificationType);

    Page<NotificationParameter> findAllByCompanyId(Long companyId, Pageable pageable);

    Optional<NotificationParameter> findByIdAndCompanyId(Long id, Long companyId);
}
