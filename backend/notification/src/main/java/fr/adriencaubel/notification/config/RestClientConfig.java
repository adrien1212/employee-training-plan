package fr.adriencaubel.notification.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.*;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;

@Configuration
public class RestClientConfig {

    @Value("${core-backend.base-url}")
    private String coreBackendBaseUrl;

    @Bean
    public OAuth2AuthorizedClientManager authorizedClientManager(
            ClientRegistrationRepository clientRegistrationRepository,
            OAuth2AuthorizedClientService authorizedClientService) {

        OAuth2AuthorizedClientProvider authorizedClientProvider =
                OAuth2AuthorizedClientProviderBuilder.builder()
                        .clientCredentials()
                        .build();

        // Use AuthorizedClientServiceOAuth2AuthorizedClientManager for client_credentials
        // Changed from DefaultOAuth2AuthorizedClientManager to AuthorizedClientServiceOAuth2AuthorizedClientManager: This manager is designed for non-web contexts (like background services, scheduled tasks, etc.) where there's no servlet request.
        AuthorizedClientServiceOAuth2AuthorizedClientManager authorizedClientManager =
                new AuthorizedClientServiceOAuth2AuthorizedClientManager(
                        clientRegistrationRepository, authorizedClientService);

        authorizedClientManager.setAuthorizedClientProvider(authorizedClientProvider);

        return authorizedClientManager;
    }

/*    @Bean
    public RestClient restClient(RestClient.Builder builder,
                                 OAuth2AuthorizedClientManager manager) {

        OAuth2ClientHttpRequestInterceptor oauth2Interceptor =
                new OAuth2ClientHttpRequestInterceptor(manager);

        oauth2Interceptor.setClientRegistrationIdResolver(request -> "notification-service");

        return builder
                .baseUrl(coreBackendBaseUrl)
                .requestInterceptor(oauth2Interceptor)  // <-- token added here
                .build();
    }*/
}
