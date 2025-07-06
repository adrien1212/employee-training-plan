package fr.adriencaubel.etp.notification.service.emailfactory;

import fr.adriencaubel.etp.notification.domain.email.EmailMessage;
import fr.adriencaubel.etp.notification.type.SessionEnrollmentRequestModel;

public interface NotificationMessageEmailBuilder {
    EmailMessage build(SessionEnrollmentRequestModel enrollment);
}
