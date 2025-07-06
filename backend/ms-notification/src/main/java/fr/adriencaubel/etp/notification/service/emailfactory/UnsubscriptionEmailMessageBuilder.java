package fr.adriencaubel.etp.notification.service.emailfactory;

import fr.adriencaubel.etp.notification.domain.email.EmailMessage;
import fr.adriencaubel.etp.notification.type.SessionEnrollmentRequestModel;

public class UnsubscriptionEmailMessageBuilder implements NotificationMessageEmailBuilder {
    @Override
    public EmailMessage build(SessionEnrollmentRequestModel e) {
        return new EmailMessage(
                e.getEmployee().getEmail(),
                "Désinscription cours : " + e.getSession().getTraining().getTitle(),
                "Suppression de votre cours",
                false
        );
    }
}