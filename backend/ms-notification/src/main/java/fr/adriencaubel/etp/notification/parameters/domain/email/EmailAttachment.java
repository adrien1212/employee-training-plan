package fr.adriencaubel.etp.notification.parameters.domain.email;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class EmailAttachment {
    private String fileName;
    private String contentType;
    private byte[] content;
}
