package fr.adriencaubel.trainingplan.emailservice.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class EmailAttachmentDto implements Serializable {
    private String fileName;
    private String contentType;
    private byte[] content;
}
