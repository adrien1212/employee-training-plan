package fr.adriencaubel.trainingplan.company.domain.model;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToOne
    private User owner;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Department> departments = new ArrayList<>();

    // Constructors
    public Company() {
    }

    public Company(String name, User user) {
        this.name = name;
        this.owner = user;
    }

    // Business method to add a department
    public void addDepartment(Department department) {
        department.setCompany(this);
        this.departments.add(department);
    }
}
