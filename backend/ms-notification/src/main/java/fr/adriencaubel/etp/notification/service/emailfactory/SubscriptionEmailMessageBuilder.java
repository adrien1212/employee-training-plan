package fr.adriencaubel.etp.notification.service.emailfactory;

import fr.adriencaubel.etp.notification.domain.email.EmailMessage;
import fr.adriencaubel.etp.notification.type.SessionEnrollmentRequestModel;

public class SubscriptionEmailMessageBuilder implements NotificationMessageEmailBuilder {
    @Override
    public EmailMessage build(SessionEnrollmentRequestModel e) {
        return new EmailMessage(
                e.getEmployee().getEmail(),
                "Inscription cours : " + e.getSession().getTraining().getTitle(),
                "Bienvenue à votre cours",
                false
        );
    }
}