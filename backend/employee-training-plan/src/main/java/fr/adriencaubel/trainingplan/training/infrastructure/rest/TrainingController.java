package fr.adriencaubel.trainingplan.training.infrastructure.rest;

import fr.adriencaubel.trainingplan.employee.application.service.EmployeeService;
import fr.adriencaubel.trainingplan.employee.domain.Employee;
import fr.adriencaubel.trainingplan.training.application.SessionService;
import fr.adriencaubel.trainingplan.training.application.TrainingService;
import fr.adriencaubel.trainingplan.training.application.dto.*;
import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.Training;
import fr.adriencaubel.trainingplan.training.domain.TrainingDocument;
import fr.adriencaubel.trainingplan.training.domain.TrainingStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/trainings")
@RequiredArgsConstructor
public class TrainingController {

    private final TrainingService trainingService;

    private final SessionService sessionService;

    private final EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<TrainingResponseModel> createTraining(@RequestBody CreateTrainingRequestModel createTrainingRequestModel) {
        Training training = trainingService.createTraining(createTrainingRequestModel);
        return ResponseEntity.ok(TrainingResponseModel.toDto(training));
    }

    @PostMapping("{trainingId}/department")
    public ResponseEntity<TrainingResponseModel> addDepartmentToTraining(@PathVariable Long trainingId, @RequestBody DepartmentIdRequestModel departmentIdRequestModel) {
        Training training = trainingService.addDepartmentToTraining(trainingId, departmentIdRequestModel);
        return ResponseEntity.ok(TrainingResponseModel.toDto(training));
    }

    @PostMapping("{trainingId}/session")
    public ResponseEntity<SessionResponseModel> createSession(@PathVariable Long trainingId, @RequestBody CreateSessionRequestModel createSessionRequestModel) {
        Session session = sessionService.createSession(trainingId, createSessionRequestModel);
        SessionResponseModel sessionResponseModel = SessionResponseModel.toDto(session);
        return new ResponseEntity<>(sessionResponseModel, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<TrainingResponseModel>> getAllTrainings(@RequestParam(required = false) TrainingStatus status, @RequestParam(required = false) Long departmentId, @RequestParam(required = false) Long employeeId, Pageable pageable) {
        Page<Training> trainings = trainingService.getAllTraining(status, departmentId, employeeId, pageable);

        Page<TrainingResponseModel> responseModelPagedModel = trainings.map(TrainingResponseModel::toDto);

        return ResponseEntity.ok(responseModelPagedModel);
    }

    @GetMapping("{id}")
    public ResponseEntity<TrainingWithDepartmentResponseModel> getById(@PathVariable Long id) {
        Training training = trainingService.getTrainingById(id);
        return ResponseEntity.ok(TrainingWithDepartmentResponseModel.toDto(training));
    }

    @GetMapping("{id}/employees")
    public ResponseEntity<List<Employee>> getAllEmployees(@PathVariable Long id, @RequestParam(value = "completed", required = false) Boolean isCompleted) {
        List<Employee> employees = employeeService.getEmployeesByTrainingId(id, isCompleted);
        return ResponseEntity.ok(employees);
    }

    @PostMapping("/{trainingId}/documents")
    public ResponseEntity<?> uploadTrainingPdf(
            @PathVariable Long trainingId,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            TrainingDocument savedDoc = trainingService.uploadTrainingPdf(
                    file,
                    trainingId
            );

            return ResponseEntity.ok(Map.of(
                    "documentId", savedDoc.getId(),
                    "filename", savedDoc.getFilename(),
                    "uploadedAt", savedDoc.getUploadedAt()
            ));

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File upload failed", e);
        }
    }

    @GetMapping("/{trainingId}/documents")
    public ResponseEntity<Page<TrainingDocumentMetadata>> listTrainingDocuments(@PathVariable Long trainingId, Pageable pageable) {
        Page<TrainingDocument> documents = trainingService.getTrainingDocuments(trainingId, pageable);

        Page<TrainingDocumentMetadata> metadataList = documents
                .map(doc -> new TrainingDocumentMetadata(
                        doc.getId(),
                        doc.getFilename(),
                        doc.getUploadedAt(),
                        doc.getUploadedByUserId(),
                        doc.getSize()
                ));

        return ResponseEntity.ok(metadataList);
    }

    @GetMapping("/{trainingId}/documents/{documentId}/download")
    public ResponseEntity<byte[]> downloadTrainingPdf(@PathVariable Long trainingId, @PathVariable String documentId) {
        TrainingDocument document = trainingService.getTrainingDocumentById(trainingId, documentId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getFilename() + "\"")
                .body(document.getFileData());
    }

    @DeleteMapping("/{trainingId}/documents/{documentId}")
    public ResponseEntity<Void> deleteTrainingPdf(@PathVariable Long trainingId, @PathVariable String documentId) {
        trainingService.deleteTrainingDocumentBy(trainingId, documentId);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countTrainings() {
        Long trainingNumber = trainingService.count();
        return ResponseEntity.ok(trainingNumber);
    }
}
