package fr.adriencaubel.notification.type;

import jakarta.annotation.Nonnull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SessionEnrollmentRequestModel {
    @Nonnull private Long id;
    @Nonnull private SessionRequestModel session;
    @Nonnull private EmployeeRequestModel employee;
}
