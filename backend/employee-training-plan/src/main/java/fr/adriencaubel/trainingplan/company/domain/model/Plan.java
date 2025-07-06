package fr.adriencaubel.trainingplan.company.domain.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "plans")
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stripe_price_id", nullable = false, unique = true)
    private String stripePriceId;

    @Column(nullable = false)
    private String name;

    @Column(name = "max_employees", nullable = false)
    private Integer maxEmployees;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(nullable = false, length = 3)
    private String currency;

    public Plan(String stripePriceId, String name, Integer maxEmployees, BigDecimal price, String currency) {
        this.stripePriceId = stripePriceId;
        this.name = name;
        this.maxEmployees = maxEmployees;
        this.price = price;
        this.currency = currency;
    }

    public Plan() {

    }
}