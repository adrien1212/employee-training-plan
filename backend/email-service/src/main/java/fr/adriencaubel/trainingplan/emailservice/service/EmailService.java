package fr.adriencaubel.trainingplan.emailservice.service;

import fr.adriencaubel.trainingplan.emailservice.dto.EmailAttachmentDto;
import fr.adriencaubel.trainingplan.emailservice.dto.EmailMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendEmail(EmailMessageDto emailMessage) {
        try {
            if (emailMessage.isHtml() || 
                !CollectionUtils.isEmpty(emailMessage.cc()) ||
                !CollectionUtils.isEmpty(emailMessage.bcc()) ||
                !CollectionUtils.isEmpty(emailMessage.attachments())) {

                sendMimeEmail(emailMessage);
            } else {
                sendSimpleEmail(emailMessage);
            }

            log.info("Email sent successfully to: {}", emailMessage.to());

        } catch (Exception e) {
            log.error("Failed to send email to: {}", emailMessage.to(), e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private void sendSimpleEmail(EmailMessageDto emailMessage) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@traino.cloud");
        message.setTo(emailMessage.to());
        message.setSubject(emailMessage.subject());
        message.setText(emailMessage.body());

        mailSender.send(message);
    }

    private void sendMimeEmail(EmailMessageDto emailMessage) throws Exception {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        helper.setFrom("noreply@traino.cloud");
        helper.setTo(emailMessage.to());
        helper.setSubject(emailMessage.subject());
        helper.setText(emailMessage.body(), emailMessage.isHtml());

        // Add CC recipients
        if (!CollectionUtils.isEmpty(emailMessage.cc())) {
            helper.setCc(emailMessage.cc().toArray(new String[0]));
        }

        // Add BCC recipients
        if (!CollectionUtils.isEmpty(emailMessage.bcc())) {
            helper.setBcc(emailMessage.bcc().toArray(new String[0]));
        }

        // Add attachments
        if (!CollectionUtils.isEmpty(emailMessage.attachments())) {
            for (EmailAttachmentDto attachment : emailMessage.attachments()) {
                helper.addAttachment(
                    attachment.getFileName(),
                    new ByteArrayResource(attachment.getContent()),
                    attachment.getContentType()
                );
            }
        }

        mailSender.send(mimeMessage);
    }
}
