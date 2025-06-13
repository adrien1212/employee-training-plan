package fr.adriencaubel.notification.listener;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationDto {
    private Long employeeId;
    private String type;
}