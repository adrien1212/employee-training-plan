package fr.adriencaubel.trainingplan.training.infrastructure.rest;

import fr.adriencaubel.trainingplan.training.application.TrainerService;
import fr.adriencaubel.trainingplan.training.application.dto.CreateTrainerRequestModel;
import fr.adriencaubel.trainingplan.training.application.dto.TrainerResponseModel;
import fr.adriencaubel.trainingplan.training.domain.Trainer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/trainers")
@RequiredArgsConstructor
public class TrainerController {
    private final TrainerService trainerService;

    @GetMapping
    public ResponseEntity<Page<TrainerResponseModel>> getAllTrainers(Pageable pageable) {
        Page<Trainer> trainerPage = trainerService.getAll(pageable);
        return ResponseEntity.ok(trainerPage.map(TrainerResponseModel::toDto));
    }

    @GetMapping("{id}")
    public ResponseEntity<TrainerResponseModel> getById(@PathVariable Long id) {
        Trainer trainerPage = trainerService.getTrainerById(id);
        return ResponseEntity.ok(TrainerResponseModel.toDto(trainerPage));
    }

    @PostMapping
    public ResponseEntity<TrainerResponseModel> createTrainer(@RequestBody CreateTrainerRequestModel trainer) {
        Trainer trainerCreated = trainerService.createTrainer(trainer);
        return new ResponseEntity<>(TrainerResponseModel.toDto(trainerCreated), HttpStatus.CREATED);
    }

    @PutMapping("{id}")
    public ResponseEntity<TrainerResponseModel> updateTrainer(@PathVariable Long id, @RequestBody CreateTrainerRequestModel updateSessionRequestModel) {
        Trainer trainer = trainerService.updateTrainer(id, updateSessionRequestModel);
        return new ResponseEntity<>(TrainerResponseModel.toDto(trainer), HttpStatus.OK);
    }
}
