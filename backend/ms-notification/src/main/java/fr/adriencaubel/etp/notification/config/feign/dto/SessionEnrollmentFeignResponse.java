package fr.adriencaubel.etp.notification.config.feign.dto;

import jakarta.annotation.Nonnull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SessionEnrollmentFeignResponse {
    @Nonnull private Long id;
    @Nonnull private SessionFeignResponse session;
    @Nonnull private EmployeeFeignResponse employee;
}
