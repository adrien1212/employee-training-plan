package fr.adriencaubel.trainingplan.signature.application;

import fr.adriencaubel.trainingplan.training.infrastructure.SessionEnrollmentRepository;
import org.springframework.stereotype.Component;

@Component
public class SignatureValidator {
    private final SessionEnrollmentRepository enrollmentRepository;

    public SignatureValidator(SessionEnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }


}