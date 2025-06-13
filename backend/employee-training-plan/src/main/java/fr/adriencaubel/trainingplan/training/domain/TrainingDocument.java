package fr.adriencaubel.trainingplan.training.domain;

import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter
@Setter
@Document(collection = "training_documents")
public class TrainingDocument {

    @Id
    private String id;

    private Long trainingId;      // Link to JPA entity
    private Long companyId;       // Link for access control
    private String filename;
    private String contentType;
    private long size;

    @Lob
    private byte[] fileData;        // For small to mid-size PDFs

    private Instant uploadedAt;
    private Long uploadedByUserId;
}