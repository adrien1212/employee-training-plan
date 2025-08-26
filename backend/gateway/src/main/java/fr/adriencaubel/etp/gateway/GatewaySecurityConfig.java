package fr.adriencaubel.etp.gateway;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
                        .requestMatchers("/api/v1/signup").permitAll()
                        .requestMatchers("/actuator/**").permitAll()
                        .requestMatchers("/menu").authenticated()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
                        .csrf(csrf -> csrf
                .disable()
        );

        return http.build();
    }
}