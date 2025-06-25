package fr.adriencaubel.trainingplan.training.domain;

import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.*;

@Getter
@Setter
@Entity
public class Training {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Company company;

    private String title;
    private String description;
    private String provider;
    private TrainingStatus status = TrainingStatus.NOT_STARTED;

    @OneToMany(mappedBy = "training", cascade = CascadeType.ALL)
    private List<Session> sessions = new ArrayList<>();

    @ManyToMany(mappedBy = "trainings", cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE
    })
    private Set<Department> departments = new HashSet<>();

    private Integer duration; // in hours

    public Training() {
    }

    public Training(Company company, String title, String description, String provider, Set<Department> departments, Integer duration) {
        this.company = company;
        this.title = title;
        this.description = description;
        this.provider = provider;
        this.duration = duration;
        for (Department department : departments) {
            this.addDepartment(department); // sync both sides
        }
    }

    /**
     * Génère un token aléatoire sécurisé
     */
    private static String generateSecureToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[30];
        random.nextBytes(bytes);

        // Encoder en Base64 et supprimer les caractères qui pourraient poser problème dans une URL
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        // Limiter la longueur
        return token.substring(0, Math.min(token.length(), 30));
    }

    public Session createSession(Company company, LocalDate startDate, LocalDate endDate, String location, Trainer trainer) {
        Session session = new Session();
        session.setCompany(company);
        session.setStartDate(startDate);
        session.setEndDate(endDate);
        session.setLocation(location);
        session.changeStatus(SessionStatus.NOT_STARTED);
        session.setEmployeeAccessToken(generateSecureToken());
        session.setTrainerAccessToken(generateSecureToken());
        session.setTrainer(trainer);
        sessions.add(session);
        session.setTraining(this);
        return session;
    }

    public void removeSession(Session session) {
        sessions.remove(session);
        session.setTraining(null);
    }

    public void addDepartment(Department department) {
        departments.add(department);
        department.getTrainings().add(this);
    }

    public void removeDepartment(Department department) {
        departments.remove(department);
        department.getTrainings().remove(this);
    }
}
