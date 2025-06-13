package fr.adriencaubel.trainingplan.training.application;

import fr.adriencaubel.trainingplan.employee.domain.Employee;

public interface NotificationPort {
    void sendNotification(Employee employee);
}
