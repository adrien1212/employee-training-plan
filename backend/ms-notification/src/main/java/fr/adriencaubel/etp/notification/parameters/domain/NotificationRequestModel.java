package fr.adriencaubel.etp.notification.parameters.domain;

import jakarta.annotation.Nonnull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationRequestModel {
    @Nonnull
    protected NotificationType type;
}
