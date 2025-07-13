package fr.adriencaubel.etp.notification.config.feign.dto;

import jakarta.annotation.Nonnull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeFeignResponse {
    @Nonnull
    private Long id;
    @Nonnull private String firstName;
    @Nonnull private String lastName;
    @Nonnull private String email;
}
