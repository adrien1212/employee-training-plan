package fr.adriencaubel.etp.notification.infrastructure.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notifications")
public class HomeController {
    @GetMapping
    public String ok() {
        return "OK";
    }
}
