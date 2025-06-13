package fr.adriencaubel.trainingplan.emailservice.dto;


import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.List;

public record EmailMessageDto(
        @JsonProperty("to") String to,
        @JsonProperty("subject") String subject,
        @JsonProperty("body") String body,
        @JsonProperty("html") boolean isHtml,
        @JsonProperty("cc") List<String> cc,
        @JsonProperty("bcc") List<String> bcc,
        @JsonProperty("attachments") List<EmailAttachmentDto> attachments
) implements Serializable {}
