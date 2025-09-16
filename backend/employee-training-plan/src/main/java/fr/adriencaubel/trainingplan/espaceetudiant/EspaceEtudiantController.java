package fr.adriencaubel.trainingplan.espaceetudiant;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/public/espace-etudiants")
@RequiredArgsConstructor
public class EspaceEtudiantController {

    private final EspaceEtudiantService espaceEtudiantService;

    @PostMapping("request-link")
    public void requestLink(@Valid @RequestBody EspaceEtudiantRequestLinkModel requestLinkModel) {
        espaceEtudiantService.requestLink(requestLinkModel);
    }

    @GetMapping("/access")
    public ResponseEntity<EspaceEtudiantResponseModel> access(@RequestParam String accessToken) {
        return ResponseEntity.ok(espaceEtudiantService.getEspaceEtudiant(accessToken));
    }
}
