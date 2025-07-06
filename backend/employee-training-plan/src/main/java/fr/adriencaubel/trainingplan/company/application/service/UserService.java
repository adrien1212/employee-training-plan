package fr.adriencaubel.trainingplan.company.application.service;

import fr.adriencaubel.trainingplan.common.exception.UserNotFoundException;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.company.domain.model.User;
import fr.adriencaubel.trainingplan.company.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User findByOidcUser(OidcUser oidcUser) {
        String actualSub = oidcUser.getAttributes().get("sub").toString();

        return userRepository.findBySub(actualSub).orElseThrow(() -> new UserNotFoundException("User not find"));
    }


    public User findByJwt(Jwt jwt) {
        String keycloakId = jwt.getSubject();

        // Find user by Keycloak ID or create if not exists
        return userRepository.findBySub(keycloakId)
                .orElseGet(() -> {
                    // Si l'user n'existe pas le rajouter en BDD donc plus besoin du filtre KeycloakUserFilter
                    // User newUser = new User();
                    // return userRepository.save(newUser);
                    return null;
                });
    }

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Jwt jwt = (Jwt) authentication.getPrincipal();

        return this.findByJwt(jwt);
    }


    public Company getCompanyOfAuthenticatedUser() {
        User user = getAuthenticatedUser();
        return user.getCompany();
    }
}
