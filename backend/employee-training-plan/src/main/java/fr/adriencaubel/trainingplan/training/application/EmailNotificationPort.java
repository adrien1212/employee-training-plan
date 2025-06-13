package fr.adriencaubel.trainingplan.training.application;

import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.domain.Session;

public interface EmailNotificationPort {
    void sendTrainingSubscriptionEmail(Employee employee, Session training);

    void sendFeedbackEmail(Employee employee, Session session, String feedbackToken);
}