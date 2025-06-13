package fr.adriencaubel.trainingplan.employee.domain;

import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * email + codeEmployee permet d'accéder aux pages publiques
 */
@Entity
@Getter
@Setter
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Company company;

    private String firstName;
    private String lastName;
    private String email;
    private String codeEmployee;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SessionEnrollment> sessionEnrollments = new ArrayList<>();

    private boolean active;

    public Employee() {
    }

    // Private constructor to enforce use of factory method
    private Employee(String firstName, String lastName, String email, Department department) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.department = department;
        this.company = department.getCompany();
        Random rand = new Random();
        this.codeEmployee = "" + (rand.nextInt(99999) + 100000);
        this.active = true;
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
