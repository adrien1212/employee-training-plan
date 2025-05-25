package fr.adriencaubel.trainingplan.training.domain.event;

import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.domain.Session;
import lombok.Getter;

@Getter
public class EmployeeSubscribedEvent {
    private final Session session;
    private final Employee employee;

    public EmployeeSubscribedEvent(Session session, Employee employee) {
        this.session = session;
        this.employee = employee;
    }
}