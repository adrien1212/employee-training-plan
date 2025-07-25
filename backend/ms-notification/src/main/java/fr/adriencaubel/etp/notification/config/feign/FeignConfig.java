package fr.adriencaubel.etp.notification.config.feign;

import feign.RequestInterceptor;
import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;

@Configuration
public class FeignConfig {

    private final OAuth2AuthorizedClientManager manager;

    public FeignConfig(OAuth2AuthorizedClientManager manager) {
        this.manager = manager;
    }

    @Bean
    public ErrorDecoder errorDecoder() {
        return new FeignErrorDecoder();
    }

    @Bean
    public RequestInterceptor oauth2FeignRequestInterceptor() {
        return template -> {
            // Must match your client-registration ID in application.yml
            OAuth2AuthorizeRequest authRequest = OAuth2AuthorizeRequest
                    .withClientRegistrationId("notification-service")
                    .principal("feign-client")    // dummy principal
                    .build();

            OAuth2AuthorizedClient client = manager.authorize(authRequest);
            if (client == null) {
                throw new IllegalStateException("Failed to authorize OAuth2 client");
            }

            String token = client.getAccessToken().getTokenValue();
            template.header("Authorization", "Bearer " + token);
        };
    }
}
