package fr.adriencaubel.trainingplan.employee.domain;

import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String email;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SessionEnrollment> sessionEnrollments = new ArrayList<>();

    public Employee() {
    }

    // Private constructor to enforce use of factory method
    private Employee(String firstName, String lastName, String email, Department department) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.department = department;
    }

    // Factory method - explicit and clear intent
    public static Employee create(String firstName, String lastName, String email, Department department) {
        if (department == null) {
            throw new DomainException("Employee must belong to a department");
        }

        return new Employee(firstName, lastName, email, department);
    }

    public void addSessionEnrollment(SessionEnrollment assignment) {
        assignment.setEmployee(this);
        this.sessionEnrollments.add(assignment);
    }
}
