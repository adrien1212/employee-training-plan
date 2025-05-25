package fr.adriencaubel.trainingplan.common.securityevaluator;

import fr.adriencaubel.trainingplan.company.application.service.UserService;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import fr.adriencaubel.trainingplan.training.domain.Training;
import fr.adriencaubel.trainingplan.training.infrastructure.TrainingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("trainingSecurityEvaluator")
@RequiredArgsConstructor
public class TrainingSecurityEvaluator {
    public final UserService userService;

    private final TrainingRepository trainingRepository;

    public boolean canAccessTraining(Long trainingId) {
        Company currentCompany = userService.getCompanyOfAuthenticatedUser();

        // Fetch the training with its departments
        Training training = trainingRepository.findByIdWithDepartments(trainingId).orElse(null);
        if (training == null || training.getDepartments() == null || training.getDepartments().isEmpty()) {
            return false;
        }

        // Check if any of the training's departments belong to the user's company
        return training.getDepartments().stream()
                .anyMatch(department -> department.getCompany().getId().equals(currentCompany.getId()));
    }
}
