package fr.adriencaubel.trainingplan.training.application.dto;

import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class PublicSessionResponseModel {
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private SessionStatus status = SessionStatus.NOT_STARTED;
    private String employeeAccessToken;
    private TrainingMini training;
    private List<PublicSessionEnrollmentResponseModel> sessionsEnrollment;
    private List<PublicSlotSignatureResponseModel> slotsSignature;

    public static PublicSessionResponseModel toDto(Session session) {
        PublicSessionResponseModel sessionResponseModel = new PublicSessionResponseModel();
        sessionResponseModel.setId(session.getId());
        sessionResponseModel.setStartDate(session.getStartDate());
        sessionResponseModel.setEndDate(session.getEndDate());
        sessionResponseModel.setLocation(session.getLocation());
        sessionResponseModel.setStatus(session.getLastStatus());
        sessionResponseModel.setEmployeeAccessToken(session.getEmployeeAccessToken());
        sessionResponseModel.setTraining(new TrainingMini(session.getTraining().getId(), session.getTraining().getTitle()));
        sessionResponseModel.setSessionsEnrollment(session.getSessionEnrollments().stream().map(PublicSessionEnrollmentResponseModel::toDto).collect(Collectors.toList()));
        sessionResponseModel.setSlotsSignature(session.getSlotSignatures().stream().map(PublicSlotSignatureResponseModel::toDto).collect(Collectors.toList()));
        return sessionResponseModel;
    }

    @AllArgsConstructor
    @Getter
    @Setter
    private static class TrainingMini {
        private Long id;
        private String title;
    }
}
