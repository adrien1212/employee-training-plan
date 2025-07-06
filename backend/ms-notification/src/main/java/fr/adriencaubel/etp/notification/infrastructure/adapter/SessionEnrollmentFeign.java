package fr.adriencaubel.etp.notification.infrastructure.adapter;

import fr.adriencaubel.etp.notification.config.FeignOAuth2Config;
import fr.adriencaubel.etp.notification.type.SessionEnrollmentRequestModel;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "sessions-enrollment",
        url  = "${core-backend.base-url}",
        configuration = FeignOAuth2Config.class)
public interface SessionEnrollmentFeign {
    @GetMapping("api/v1/sessions-enrollment/{id}")
    ResponseEntity<SessionEnrollmentRequestModel> getSessionEnrollment(@PathVariable("id") Long id);
}
