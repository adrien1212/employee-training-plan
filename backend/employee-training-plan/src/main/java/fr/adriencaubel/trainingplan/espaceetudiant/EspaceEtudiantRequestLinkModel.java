package fr.adriencaubel.trainingplan.espaceetudiant;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class EspaceEtudiantRequestLinkModel {
    @NotNull
    private String email;
}
