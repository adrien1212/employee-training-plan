package fr.adriencaubel.trainingplan.common.filter;

import fr.adriencaubel.trainingplan.company.domain.model.User;
import fr.adriencaubel.trainingplan.company.infrastructure.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class KeycloakUserFilter extends OncePerRequestFilter {

    @Autowired
    private UserRepository userRepository;

    /**
     * Ajoute l'utilisateur authentifié à la table User s'il n'y est pas encore
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Get the authenticated principal
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() && authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken keycloakAuth = (JwtAuthenticationToken) authentication;
            Jwt principal = (Jwt) keycloakAuth.getPrincipal();

            // Get Keycloak subject ID
            String sub = principal.getClaimAsString("sub");

            // Check if user exists in our database
            if (!userRepository.existsBySub(sub)) {
                // Create new user with info from Keycloak
                User newUser = new User();
                newUser.setSub(sub);

                // Save the new user
                userRepository.save(newUser);
            }
        }

        filterChain.doFilter(request, response);
    }
}