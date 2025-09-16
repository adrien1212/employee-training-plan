package fr.adriencaubel.trainingplan.training.infrastructure.rest;

import fr.adriencaubel.trainingplan.training.application.SessionEnrollmentService;
import fr.adriencaubel.trainingplan.training.application.dto.PublicSessionEnrollmentResponseModel;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("v1/public/sessions-enrollment")
@RequiredArgsConstructor
public class PublicSessionEnrollmentController {

    private final SessionEnrollmentService sessionEnrollmentService;

    @GetMapping("{accessToken}")
    public PublicSessionEnrollmentResponseModel getSessionEnrollment(@PathVariable String accessToken) {
        SessionEnrollment sessionEnrollment = sessionEnrollmentService.findByAccessToken(accessToken);

        PublicSessionEnrollmentResponseModel p = PublicSessionEnrollmentResponseModel.toDto(sessionEnrollment);

        return p;
    }
}
