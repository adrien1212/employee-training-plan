package fr.adriencaubel.trainingplan.training.domain.event;

import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.Training;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
public class SessionCompletedEvent {
    private final Session session;
    private final List<Employee> enrolledEmployees;

    public SessionCompletedEvent(Session Session, List<Employee> enrolledEmployees) {
        this.session = Session;
        this.enrolledEmployees = enrolledEmployees;
    }
}
