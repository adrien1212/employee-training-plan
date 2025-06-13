package fr.adriencaubel.trainingplan.training.infrastructure.adapter;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailAttachmentDto {
    private String fileName;
    private String contentType;
    private byte[] content;
}
