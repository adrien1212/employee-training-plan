package fr.adriencaubel.etp.notification.parameters.domain.email;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class EmailMessage {
    private String to;
    private String subject;
    private String body;
    private boolean isHtml;
    private List<String> cc;
    private List<String> bcc;
    private List<EmailAttachment> attachments;
}
