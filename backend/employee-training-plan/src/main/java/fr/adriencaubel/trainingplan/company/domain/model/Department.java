package fr.adriencaubel.trainingplan.company.domain.model;


import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.domain.Training;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    private List<Employee> employees;

    @ManyToMany
    @JoinTable(name = "department_training",
            joinColumns = {@JoinColumn(name = "fk_department_id")},
            inverseJoinColumns = {@JoinColumn(name = "fk_training_id")})
    private Set<Training> trainings = new HashSet<>();

    public Department() {
    }

    public Department(String name) {
        this.name = name;
    }
}