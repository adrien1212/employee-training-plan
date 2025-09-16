package fr.adriencaubel.trainingplan.espaceetudiant;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EspaceEtudiantAccessLinkRepository extends JpaRepository<EspaceEtudiantAccessLink, Long> {
    Optional<EspaceEtudiantAccessLink> findByAccessToken(String accessToken);
}
