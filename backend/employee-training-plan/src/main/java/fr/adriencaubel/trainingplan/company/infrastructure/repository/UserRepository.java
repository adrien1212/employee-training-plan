package fr.adriencaubel.trainingplan.company.infrastructure.repository;

import fr.adriencaubel.trainingplan.company.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findBySub(String sub);

    boolean existsBySub(String sub);
}
