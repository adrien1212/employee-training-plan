package fr.adriencaubel.trainingplan.testing;

import fr.adriencaubel.trainingplan.training.application.NotificationPort;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("v1/test")
@RequiredArgsConstructor
public class TestController {

    private final NotificationPort notificationPort;

    @PostMapping("/send-email")
    public ResponseEntity<String> test(@RequestBody TestEmailRequestModel testEmailRequestModel) {
        notificationPort.sendTestNotification(testEmailRequestModel);
        return ResponseEntity.ok("OK");
    }
}
