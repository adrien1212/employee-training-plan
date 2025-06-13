package fr.adriencaubel.trainingplan.training.application.dto;

import fr.adriencaubel.trainingplan.training.domain.Trainer;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrainerResponseModel {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String speciality;

    public static TrainerResponseModel toDto(Trainer trainer) {
        TrainerResponseModel trainerResponseModel = new TrainerResponseModel();
        trainerResponseModel.setId(trainer.getId());
        trainerResponseModel.setFirstName(trainer.getFirstName());
        trainerResponseModel.setLastName(trainer.getLastName());
        trainerResponseModel.setEmail(trainer.getEmail());
        trainerResponseModel.setSpeciality(trainer.getSpeciality());
        return trainerResponseModel;
    }
}
