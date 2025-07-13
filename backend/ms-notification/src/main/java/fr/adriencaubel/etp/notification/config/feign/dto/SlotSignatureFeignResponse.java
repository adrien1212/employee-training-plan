package fr.adriencaubel.etp.notification.config.feign.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class SlotSignatureFeignResponse {
    private Long id;
    private Long sessionId;
    private LocalDate slotDate;
    private String periode;
    private String token;
}
