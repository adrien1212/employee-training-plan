package fr.adriencaubel.etp.notification.infrastructure.repository;


import fr.adriencaubel.etp.notification.domain.NotificationParameter;
import fr.adriencaubel.etp.notification.domain.sessionenrollment.NotificationSessionEnrollmentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationParameterRepository extends JpaRepository<NotificationParameter, Long> {
    List<NotificationParameter> findAllByNotificationType(NotificationSessionEnrollmentType notificationType);

    Page<NotificationParameter> findAllByCompanyId(Long companyId, Pageable pageable);

    Optional<NotificationParameter> findByIdAndCompanyId(Long id, Long companyId);
}
