package fr.adriencaubel.etp.notification.domain.email;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailAttachment {
    private String fileName;
    private String contentType;
    private byte[] content;
}
