package fr.adriencaubel.etp.notification.config.feign.dto;

import jakarta.annotation.Nonnull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class SessionFeignResponse {
    @Nonnull
    private Long id;
    @Nonnull private LocalDate startDate;
    @Nonnull private LocalDate endDate;
    @Nonnull private String location;
    @Nonnull private TrainingMini training;

    @AllArgsConstructor
    @Getter
    @Setter
    public static class TrainingMini {
        private Long id;
        private String title;
    }
}
