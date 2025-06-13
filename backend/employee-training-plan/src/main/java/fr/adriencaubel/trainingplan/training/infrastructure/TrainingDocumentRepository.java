package fr.adriencaubel.trainingplan.training.infrastructure;

import fr.adriencaubel.trainingplan.training.domain.TrainingDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TrainingDocumentRepository extends MongoRepository<TrainingDocument, String> {

    List<TrainingDocument> findByTrainingId(Long trainingId);

    List<TrainingDocument> findByCompanyId(Long companyId);
}
