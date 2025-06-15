package fr.adriencaubel.notification.domain;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EmailMessageDto {
    private String to;
    private String subject;
    private String body;
    private boolean isHtml;
    private List<String> cc;
    private List<String> bcc;
    private List<EmailAttachmentDto> attachments;
}
