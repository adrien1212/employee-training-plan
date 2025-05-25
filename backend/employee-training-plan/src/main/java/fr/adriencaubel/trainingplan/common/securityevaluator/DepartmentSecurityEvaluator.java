package fr.adriencaubel.trainingplan.common.securityevaluator;

import fr.adriencaubel.trainingplan.company.application.service.DepartmentService;
import fr.adriencaubel.trainingplan.company.application.service.UserService;
import fr.adriencaubel.trainingplan.company.domain.model.Company;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component("departmentSecurityEvaluator")
@RequiredArgsConstructor
public class DepartmentSecurityEvaluator {

    private final UserService userService;

    private final DepartmentService departmentService;

    public boolean canAccessDepartment(Long departmentId) {
        Company company = userService.getCompanyOfAuthenticatedUser();
        return departmentService.existsByIdAndCompany(departmentId, company);
    }

    public boolean canAccessDepartments(List<Long> departmentsId) {
        Company company = userService.getCompanyOfAuthenticatedUser();
        for (Long departmentId : departmentsId) {
            if (!departmentService.existsByIdAndCompany(departmentId, company)) {
                return false;
            }
        }
        return true;
    }
}
