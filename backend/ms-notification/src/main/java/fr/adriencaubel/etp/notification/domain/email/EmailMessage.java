package fr.adriencaubel.etp.notification.domain.email;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EmailMessage {
    private String to;
    private String subject;
    private String body;
    private boolean isHtml;
    private List<String> cc;
    private List<String> bcc;
    private List<EmailAttachment> attachments;

    public EmailMessage(String to, String subject, String body, boolean isHtml) {
        this.to = to;
        this.subject = subject;
        this.body = body;
        this.isHtml = isHtml;
    }
}
