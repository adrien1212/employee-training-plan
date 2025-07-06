package fr.adriencaubel.etp.notification.service.emailfactory;

import fr.adriencaubel.etp.notification.domain.sessionenrollment.NotificationSessionEnrollmentType;

public class NotificationEmailMessageFactory {
    public NotificationMessageEmailBuilder getBuilder(NotificationSessionEnrollmentType type) {
        return switch (type) {
            case SUBSCRIBE_TO_SESSION     -> new SubscriptionEmailMessageBuilder();
            case UNSUBSCRIBE_TO_SESSION   -> new UnsubscriptionEmailMessageBuilder();
            case SESSION_REMINDER         -> new SessionReminderEmailMessageBuilder();
            default            -> throw new IllegalArgumentException("No builder for " + type);
        };
    }
}
