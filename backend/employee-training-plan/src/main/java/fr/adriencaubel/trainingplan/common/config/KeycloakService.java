package fr.adriencaubel.trainingplan.common.config;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Service
public class KeycloakService {

    private static final Logger logger = LoggerFactory.getLogger(KeycloakService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Value("${keycloak.server-url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.admin.username}")
    private String adminUsername;

    @Value("${keycloak.admin.password}")
    private String adminPassword;

    public String createUser(String email, String password, String firstName, String lastName, Long companyId) {
        try {
            String adminToken = getAdminToken();

            // Create user payload
            Map<String, Object> user = new HashMap<>();
            user.put("email", email);
            user.put("username", email);
            user.put("firstName", firstName);
            user.put("lastName", lastName);
            user.put("enabled", true);
            user.put("emailVerified", true);

            // Add custom attributes including companyId
            Map<String, Object> attributes = new HashMap<>();
            attributes.put("companyId", Arrays.asList(companyId));
            user.put("attributes", attributes);

            // Set password
            Map<String, Object> credential = new HashMap<>();
            credential.put("type", "password");
            credential.put("value", password);
            credential.put("temporary", false);
            user.put("credentials", Arrays.asList(credential));

            // Create user in YOUR realm (not master)
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(adminToken);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(user, headers);

            String url = serverUrl + "/admin/realms/" + realm + "/users";
            logger.info("Creating user at URL: {}", url);

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                String location = response.getHeaders().getFirst("Location");
                String userId = location.substring(location.lastIndexOf('/') + 1);
                logger.info("Successfully created user with ID: {}", userId);
                return userId;
            } else {
                throw new RuntimeException("Failed to create user. Status: " + response.getStatusCode());
            }

        } catch (Exception e) {
            logger.error("Error creating user in Keycloak", e);
            throw new RuntimeException("Failed to create user in Keycloak: " + e.getMessage(), e);
        }
    }

    private Keycloak getKeycloakInstance() {
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm)
                .username(adminUsername)
                .password(adminPassword)
                .clientId("admin-cli")
                .build();
    }

    private String getAdminToken() {
        try {
            // IMPORTANT: Use master realm for authentication
            String tokenUrl = serverUrl + "/realms/master/protocol/openid-connect/token";
            logger.info("Getting admin token from: {}", tokenUrl);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "password");
            params.add("client_id", "admin-cli");
            params.add("username", adminUsername);
            params.add("password", adminPassword);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> tokenResponse = response.getBody();
                String accessToken = (String) tokenResponse.get("access_token");
                logger.info("Successfully obtained admin token");
                return accessToken;
            } else {
                throw new RuntimeException("Failed to get admin token. Status: " + response.getStatusCode());
            }

        } catch (Exception e) {
            logger.error("Error getting admin token", e);
            throw new RuntimeException("Failed to get admin token: " + e.getMessage(), e);
        }
    }
}
