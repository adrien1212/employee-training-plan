package fr.adriencaubel.trainingplan.training.application.dto;

import java.time.Instant;

public record TrainingDocumentMetadata(
        String id,
        String filename,
        Instant uploadedAt,
        Long uploadedByUserId,
        long size
) {
}