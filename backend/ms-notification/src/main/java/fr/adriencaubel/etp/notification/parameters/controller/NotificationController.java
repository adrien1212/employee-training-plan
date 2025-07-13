package fr.adriencaubel.etp.notification.parameters.controller;

import fr.adriencaubel.etp.notification.parameters.domain.NotificationParameter;
import fr.adriencaubel.etp.notification.sessionenrollment.service.NotificationSessionEnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationSessionEnrollmentService notificationService;

    @GetMapping
    public String ok() {
        return "OK";
    }

    @GetMapping("/parameters")
    public ResponseEntity<Page<NotificationParameterResponseModel>> getParameters(Pageable pageable) {
        Page<NotificationParameter> notificationParameterPage = notificationService.getNotificationParameters(pageable);


        if(notificationParameterPage.isEmpty()) {
            return ResponseEntity.ok(Page.empty());
        }

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
