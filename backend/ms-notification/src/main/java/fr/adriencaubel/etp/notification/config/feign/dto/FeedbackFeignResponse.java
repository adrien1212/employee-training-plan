package fr.adriencaubel.etp.notification.config.feign.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackFeignResponse {
    private Long id;
    private String feedbackToken;
    private SessionEnrollmentFeignResponse sessionEnrollment;
}
