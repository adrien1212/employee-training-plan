package fr.adriencaubel.trainingplan.company.infrastructure.rest;

import fr.adriencaubel.trainingplan.company.application.dto.DepartmentResponseModel;
import fr.adriencaubel.trainingplan.company.application.service.DepartmentService;
import fr.adriencaubel.trainingplan.company.domain.model.Department;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("v1/departments")
@RequiredArgsConstructor
public class DepartmentController {
    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<DepartmentResponseModel>> getAll() {
        List<Department> departments = departmentService.findAll();

        List<DepartmentResponseModel> departmentResponseModels = departments.stream().map(DepartmentResponseModel::toDto).toList();

        return ResponseEntity.ok(departmentResponseModels);
    }

    @GetMapping("{id}")
    public ResponseEntity<DepartmentResponseModel> getById(@PathVariable("id") Long id) {
        Department department = departmentService.findById(id);
        return ResponseEntity.ok(DepartmentResponseModel.toDto(department));
    }
}
