package fr.adriencaubel.etp.notification.infrastructure.controller;

import fr.adriencaubel.etp.notification.domain.NotificationParameter;
import fr.adriencaubel.etp.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public String ok() {
        return "OK";
    }

    @GetMapping("/parameters")
    public ResponseEntity<Page<NotificationParameterResponseModel>> getParameters(Pageable pageable) {
        Page<NotificationParameter> notificationParameterPage = notificationService.getNotificationParameters(pageable);

        Page<NotificationParameterResponseModel> notificationParameterResponseModels = notificationParameterPage.map(NotificationParameterResponseModel::toDto);

        return ResponseEntity.ok(notificationParameterResponseModels);
    }

    @PutMapping("/parameters/{id}/enable")
    public void enableNotification(@PathVariable Long id) {
        notificationService.enableNotificationParameter(id, true);
    }

    @DeleteMapping("/parameters/{id}/enable")
    public void disableNotification(@PathVariable Long id) {
        notificationService.enableNotificationParameter(id, false);
    }
}
