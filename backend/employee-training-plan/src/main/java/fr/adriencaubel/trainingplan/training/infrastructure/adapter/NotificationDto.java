package fr.adriencaubel.trainingplan.training.infrastructure.adapter;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationDto {
    private Long employeeId;
    private String type;
}
