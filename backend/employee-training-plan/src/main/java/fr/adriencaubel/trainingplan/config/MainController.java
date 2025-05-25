package fr.adriencaubel.trainingplan.config;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {

    /**
     * Maps the root URL ("/") to the home page.
     *
     * @return the name of the view to render for the home page
     */
    @GetMapping("/")
    public String home() {
        return "home";
    }

    /**
     * Maps the "/menu" URL to the menu page and sets the authenticated user's username in the model.
     *
     * @param user  the authenticated OIDC (OpenID Connect) user
     * @return the name of the view to render for the menu page, or redirects to home if user is not authenticated
     */
    @GetMapping("/menu")
    public String menu(@AuthenticationPrincipal OidcUser user) {
        System.out.println(user.getAttributes().get("sub"));
        return "menu";
    }
}