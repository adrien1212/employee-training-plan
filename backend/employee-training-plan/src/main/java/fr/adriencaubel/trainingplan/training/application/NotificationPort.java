package fr.adriencaubel.trainingplan.training.application;

import fr.adriencaubel.trainingplan.signature.domain.SlotSignature;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;

import java.time.LocalDateTime;

public interface NotificationPort {
    void sendSubscribeNotification(SessionEnrollment sessionEnrollment);

    void sendUnsubscribeNotification(SessionEnrollment sessionEnrollment);

    void sendSessionReminderNotification(SessionEnrollment sessionEnrollment, LocalDateTime scheduledTime);

    void sendSlotOpenNotification(SlotSignature slotSignature);

    void sendSessionCompletedNotification(SessionEnrollment sessionEnrollment);
}
