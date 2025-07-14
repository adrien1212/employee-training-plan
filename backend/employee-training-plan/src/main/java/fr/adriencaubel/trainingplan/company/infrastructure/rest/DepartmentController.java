package fr.adriencaubel.trainingplan.company.infrastructure.rest;

import fr.adriencaubel.trainingplan.company.application.dto.DepartmentResponseModel;
import fr.adriencaubel.trainingplan.company.application.service.DepartmentService;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/departments")
@RequiredArgsConstructor
public class DepartmentController {
    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<Page<DepartmentResponseModel>> getAll(@RequestParam(required = false) Long trainingId, Pageable pageable) {
        Page<Department> departments = departmentService.findAll(trainingId, pageable);

        Page<DepartmentResponseModel> departmentResponseModels = departments.map(DepartmentResponseModel::toDto);

        return ResponseEntity.ok(departmentResponseModels);
    }

    @GetMapping("{id}")
    public ResponseEntity<DepartmentResponseModel> getById(@PathVariable("id") Long id) {
        Department department = departmentService.findById(id);
        return ResponseEntity.ok(DepartmentResponseModel.toDto(department));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countDepartments() {
        Long departmentNumber = departmentService.count();
        return ResponseEntity.ok(departmentNumber);
    }
}
