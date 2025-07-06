package fr.adriencaubel.etp.notification.service.emailfactory;

import fr.adriencaubel.etp.notification.domain.email.EmailMessage;
import fr.adriencaubel.etp.notification.type.SessionEnrollmentRequestModel;

public class SessionReminderEmailMessageBuilder implements NotificationMessageEmailBuilder{
    @Override
    public EmailMessage build(SessionEnrollmentRequestModel sessionEnrollmentRequestModel) {
        return new EmailMessage(
                sessionEnrollmentRequestModel.getEmployee().getEmail(),
                "Rappel pour votre formation : " + sessionEnrollmentRequestModel.getSession().getTraining().getTitle(),
                "Votre formation aura lieu le " + sessionEnrollmentRequestModel.getSession().getStartDate(),
                false
        );
    }
}
