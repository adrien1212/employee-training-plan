package fr.adriencaubel.notification.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailAttachmentDto {
    private String fileName;
    private String contentType;
    private byte[] content;
}
