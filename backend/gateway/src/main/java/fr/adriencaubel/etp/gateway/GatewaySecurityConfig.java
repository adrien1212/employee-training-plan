package fr.adriencaubel.etp.gateway;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class GatewaySecurityConfig {

    private final CustomCorsConfiguration customCorsConfiguration;

    public GatewaySecurityConfig(CustomCorsConfiguration customCorsConfiguration) {
        this.customCorsConfiguration = customCorsConfiguration;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(c -> c.configurationSource(customCorsConfiguration))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/").permitAll() // Allows public access to the root URL
                        .requestMatchers("/v1/signup").permitAll()
                        .requestMatchers("/actuator/**").permitAll()
                        .requestMatchers("/webhook").permitAll()
                        .requestMatchers("/v1/public/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/swagger-ui/**", "/v3/**").permitAll() // http://localhost:8080/api/swagger-ui/index.html#/ et  http://localhost:8080/api/v3/api-docs
                        .anyRequest().authenticated() // Requires authentication for any other request
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
                        .csrf(csrf -> csrf
                .disable()
        );

        return http.build();
    }
}