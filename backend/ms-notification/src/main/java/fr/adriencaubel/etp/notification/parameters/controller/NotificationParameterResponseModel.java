package fr.adriencaubel.etp.notification.parameters.controller;

import fr.adriencaubel.etp.notification.parameters.domain.NotificationParameter;
import fr.adriencaubel.etp.notification.parameters.domain.NotificationType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationParameterResponseModel {
    private Long id;
    private String name;
    private NotificationType notificationType;
    private Integer period;
    private boolean enabled;

    public static NotificationParameterResponseModel toDto(NotificationParameter notificationParameter) {
        NotificationParameterResponseModel notificationParameterResponseModel = new NotificationParameterResponseModel();
        notificationParameterResponseModel.setId(notificationParameter.getId());
        notificationParameterResponseModel.setName(notificationParameter.getName());
        notificationParameterResponseModel.setEnabled(notificationParameter.isEnabled());
        notificationParameterResponseModel.setPeriod(notificationParameter.getPeriod());
        notificationParameterResponseModel.setNotificationType(notificationParameter.getNotificationType());
        return notificationParameterResponseModel;
    }
}
