package fr.adriencaubel.trainingplan.common.config;

import fr.adriencaubel.trainingplan.company.domain.model.Plan;
import fr.adriencaubel.trainingplan.company.infrastructure.repository.PlanRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class PlanInitializer implements ApplicationRunner {

    private final PlanRepository planRepo;

    public PlanInitializer(PlanRepository planRepo) {
        this.planRepo = planRepo;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Only seed if empty
        if (planRepo.count() == 0) {
            List<Plan> plans = List.of(
                    new Plan("price_free", "free", 5, new BigDecimal(0), "EUR"),
                    new Plan("price_essentiel", "essentiel", 50, new BigDecimal(5), "EUR"),
                    new Plan("price_business", "business", 200, new BigDecimal(10), "EUR"),
                    new Plan("price_enterprise", "enterprise", 999, new BigDecimal(20), "EUR")
            );
            planRepo.saveAll(plans);
        }
    }
}