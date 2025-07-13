package fr.adriencaubel.trainingplan.signup.controller;

import fr.adriencaubel.trainingplan.signup.SignupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/signup")
@RequiredArgsConstructor
public class SignUpController {

    private final SignupService signupService;

    @PostMapping
    public ResponseEntity<RegistrationResponse> signup(@RequestBody RegistrationRequest req) {
        RegistrationResponse response = signupService.registerCompany(req);
        return ResponseEntity.ok(response);
    }

}
