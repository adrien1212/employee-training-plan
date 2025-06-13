package fr.adriencaubel.trainingplan.training.application.dto;

public record TokenValidationResponse(boolean valid, Long sessionId, Long employeeId) {
}
