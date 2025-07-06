package fr.adriencaubel.etp.notification.domain;


import fr.adriencaubel.etp.notification.domain.sessionenrollment.NotificationSessionEnrollmentType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class NotificationParameter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long companyId;

    private String name;

    @Enumerated(EnumType.STRING)
    private NotificationSessionEnrollmentType notificationType;

    // EN heure
    private Integer period;

    private boolean enabled;

    public NotificationParameter() {
    }

    public NotificationParameter(String name, NotificationSessionEnrollmentType notificationType, Integer period, boolean enabled) {
        this.name = name;
        this.notificationType = notificationType;
        this.period = period;
        this.enabled = enabled;
    }
}
