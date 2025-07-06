package fr.adriencaubel.trainingplan.training.infrastructure;

import fr.adriencaubel.trainingplan.training.domain.TrainingDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TrainingDocumentRepository extends MongoRepository<TrainingDocument, String> {

    Page<TrainingDocument> findByTrainingId(Long trainingId, Pageable pageable);
}
