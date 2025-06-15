package fr.adriencaubel.trainingplan.training.application;

import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;

public interface NotificationPort {
    void sendSubscribeNotification(SessionEnrollment sessionEnrollment);

    void sendUnsubscribeNotification(SessionEnrollment sessionEnrollment);
}
