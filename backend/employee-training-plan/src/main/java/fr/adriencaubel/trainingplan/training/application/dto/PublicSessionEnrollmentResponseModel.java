package fr.adriencaubel.trainingplan.training.application.dto;

import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PublicSessionEnrollmentResponseModel {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String trainingTitle;
    private String sessionLocation;
    private LocalDate sessionStartDate;
    private LocalDate sessionEndDate;
    private SessionStatus sessionStatus;
    private boolean hasSigned;
    private String signatureToken;

    public static PublicSessionEnrollmentResponseModel toDto(SessionEnrollment sessionEnrollment) {
        PublicSessionEnrollmentResponseModel sessionResponseModel = new PublicSessionEnrollmentResponseModel();
        sessionResponseModel.setId(sessionEnrollment.getId());
        sessionResponseModel.setFirstName(sessionEnrollment.getEmployee().getFirstName());
        sessionResponseModel.setLastName(sessionEnrollment.getEmployee().getLastName());
        sessionResponseModel.setEmail(sessionEnrollment.getEmployee().getEmail());
        sessionResponseModel.setTrainingTitle(sessionEnrollment.getSession().getTraining().getTitle());
        sessionResponseModel.setSessionLocation(sessionEnrollment.getSession().getLocation());
        sessionResponseModel.setSessionStartDate(sessionEnrollment.getSession().getStartDate());
        sessionResponseModel.setSessionEndDate(sessionEnrollment.getSession().getEndDate());
        sessionResponseModel.setSessionStatus(sessionEnrollment.getSession().getLastStatus());
        //sessionResponseModel.setHasSigned(sessionEnrollment.getSignature().getSignature() != null);
        //sessionResponseModel.setSignatureToken(sessionEnrollment.getSignature().getAccessToken());
        return sessionResponseModel;
    }
}
