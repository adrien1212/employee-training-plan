package fr.adriencaubel.etp.notification.type;

import jakarta.annotation.Nonnull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeRequestModel {
    @Nonnull
    private Long id;
    @Nonnull private String firstName;
    @Nonnull private String lastName;
    @Nonnull private String email;
}
