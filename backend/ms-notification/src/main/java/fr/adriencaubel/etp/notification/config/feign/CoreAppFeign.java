package fr.adriencaubel.etp.notification.config.feign;

import fr.adriencaubel.etp.notification.config.FeignConfig;
import fr.adriencaubel.etp.notification.config.feign.dto.SessionEnrollmentFeignResponse;
import fr.adriencaubel.etp.notification.config.feign.dto.SlotSignatureFeignResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "employee-training-plan",
        configuration = FeignConfig.class)
public interface CoreAppFeign {
    @GetMapping("api/v1/sessions-enrollment/{id}")
    ResponseEntity<SessionEnrollmentFeignResponse> getSessionEnrollment(@PathVariable("id") Long id);

    @GetMapping("api/v1/slots-signature/{id}")
    ResponseEntity<SlotSignatureFeignResponse> getSlotSignature(@PathVariable("id") Long id);

    @GetMapping("api/v1/slots-signature/{id}/missing-signatures")
    ResponseEntity<Page<SessionEnrollmentFeignResponse>> getMissingSignatures(@PathVariable("id") Long id);
}
