package fr.adriencaubel.trainingplan.training.application;

import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.training.application.dto.CreateTrainerRequestModel;
import fr.adriencaubel.trainingplan.training.domain.Trainer;
import fr.adriencaubel.trainingplan.training.infrastructure.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrainerService {
    private final TrainerRepository trainerRepository;

    public Trainer getTrainerById(Long trainerId) {
        return trainerRepository.findById(trainerId).orElseThrow(() -> new DomainException("trainer not found"));
    }

    public Page<Trainer> getAll(Pageable pageable) {
        return trainerRepository.findAll(pageable);
    }

    public Trainer createTrainer(CreateTrainerRequestModel trainerRequestModel) {
        Trainer trainer = new Trainer();
        trainer.setEmail(trainerRequestModel.getEmail());
        trainer.setFirstName(trainerRequestModel.getFirstName());
        trainer.setLastName(trainerRequestModel.getLastName());
        trainer.setSpeciality(trainerRequestModel.getSpeciality());
        return trainerRepository.save(trainer);
    }

    public Trainer updateTrainer(Long id, CreateTrainerRequestModel updateSessionRequestModel) {
        Trainer trainer = getTrainerById(id);
        if (trainer.getFirstName() != null) {
            trainer.setFirstName(updateSessionRequestModel.getFirstName());
        }
        if (trainer.getLastName() != null) {
            trainer.setLastName(updateSessionRequestModel.getLastName());
        }
        if (trainer.getEmail() != null) {
            trainer.setEmail(updateSessionRequestModel.getEmail());
        }
        if (trainer.getSpeciality() != null) {
            trainer.setSpeciality(updateSessionRequestModel.getSpeciality());
        }
        return trainerRepository.save(trainer);
    }
}

