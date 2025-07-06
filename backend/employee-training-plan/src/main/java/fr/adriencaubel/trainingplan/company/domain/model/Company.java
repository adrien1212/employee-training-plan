package fr.adriencaubel.trainingplan.company.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "stripe_customer_id", nullable = false, unique = true)
    private String stripeCustomerId;

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;

    @Column(name = "stripe_subscription_id", unique = true)
    private String stripeSubscriptionId;

    @Column(name = "subscription_status")
    private String subscriptionStatus;

    @Column(name = "trial_end")
    private LocalDate trialEnd;

    @Column(name = "current_period_end")
    private LocalDate currentPeriodEnd;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Department> departments = new ArrayList<>();

    // Constructors
    public Company() {
    }

    public Company(String name, User user) {
        this.name = name;
        users.add(user);
    }

    public void addUser(User user) {
        users.add(user);
        user.setCompany(this);
    }

    // Business method to add a department
    public void addDepartment(Department department) {
        department.setCompany(this);
        this.departments.add(department);
    }
}
