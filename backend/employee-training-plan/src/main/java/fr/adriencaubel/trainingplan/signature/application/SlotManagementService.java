package fr.adriencaubel.trainingplan.signature.application;

import fr.adriencaubel.trainingplan.common.exception.DomainException;
import fr.adriencaubel.trainingplan.signature.application.dto.EnrollmentSignatureStatus;
import fr.adriencaubel.trainingplan.signature.domain.ModeSignature;
import fr.adriencaubel.trainingplan.signature.domain.SlotSignature;
import fr.adriencaubel.trainingplan.signature.infrastructure.SignatureRepository;
import fr.adriencaubel.trainingplan.signature.infrastructure.SlotSignatureRepository;
import fr.adriencaubel.trainingplan.training.application.SessionEnrollmentService;
import fr.adriencaubel.trainingplan.training.domain.Session;
import fr.adriencaubel.trainingplan.training.domain.SessionEnrollment;
import fr.adriencaubel.trainingplan.training.infrastructure.SessionEnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SlotManagementService {

    private final SlotSignatureRepository slotRepository;
    private final SessionEnrollmentService sessionEnrollmentService;
    private final SignatureRepository signatureRepository;
    private final SessionEnrollmentRepository sessionEnrollmentRepository;

    @Transactional
    public void createSlotsFor(Session session) {
        LocalDate start = session.getStartDate();
        LocalDate end = session.getEndDate();
        ModeSignature mode = session.getModeSignature();

        if (mode == null) {
            throw new DomainException("ModeSignature is null");
        }

        List<SlotSignature> slots = new ArrayList<>();
        switch (mode) {
            case GLOBAL:
                // Un seul créneau pour toute la session
                slots.add(new SlotSignature(
                        session,
                        start, SlotSignature.Periode.GLOBAL
                ));
                break;

            case QUOTIDIEN:
                // Un créneau par jour
                for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
                    slots.add(new SlotSignature(
                            session,
                            date, SlotSignature.Periode.JOUR
                    ));
                }
                break;

            case DEMI_JOURNEE:
                // Deux créneaux (matin/après-midi) par jour
                for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
                    slots.add(new SlotSignature(
                            session,
                            date, SlotSignature.Periode.MATIN
                    ));
                    slots.add(new SlotSignature(
                            session,
                            date, SlotSignature.Periode.APRESMIDI
                    ));
                }
                break;
        }

        // Persister tous les créneaux d'un coup
        slotRepository.saveAll(slots);
    }

    @Transactional(readOnly = true)
    public List<SlotSignature> findMissingSignaturesForEnrollment(Long enrollmentId) {
        // 1. Récupérer l'enrollment et sa session
        SessionEnrollment enrollment = sessionEnrollmentService.findById(enrollmentId);
        Long sessionId = enrollment.getSession().getId();

        // 2. Récupérer tous les créneaux de la session
        List<SlotSignature> slots = slotRepository.findBySessionId(sessionId, Pageable.unpaged()).stream().toList();

        // 3. Récupérer les créneaux déjà signés par cet enrollment
        Set<Long> signedSlotIds = signatureRepository
                .findBySessionEnrollmentId(enrollmentId)
                .stream()
                .map(sig -> sig.getSlotSignature().getId())
                .collect(Collectors.toSet());

        // 4. Filtrer les créneaux non signés
        return slots.stream()
                .filter(slot -> !signedSlotIds.contains(slot.getId()))
                .collect(Collectors.toList());
    }

    /**
     * Service pour récupérer le statut des signatures d'un Enrollment :
     * liste des créneaux signés et non signés.
     */
    @Transactional(readOnly = true)
    public EnrollmentSignatureStatus getSignatureStatus(Long enrollmentId) {
        // 1. Récupérer l'enrollment et sa session
        SessionEnrollment enrollment = sessionEnrollmentService.findById(enrollmentId);
        Long sessionId = enrollment.getSession().getId();

        // 2. Récupérer tous les créneaux de la session
        List<SlotSignature> allSlots = slotRepository.findBySessionId(sessionId, Pageable.unpaged()).stream().toList();

        // 3. IDs des créneaux déjà signés par cet enrollment
        Set<Long> signedSlotIds = signatureRepository
                .findBySessionEnrollmentId(enrollmentId)
                .stream()
                .map(sig -> sig.getSlotSignature().getId())
                .collect(Collectors.toSet());

        // 4. Partitionner les slots en signés et non signés
        List<SlotSignature> signedSlots = new ArrayList<>();
        List<SlotSignature> missingSlots = new ArrayList<>();

        for (SlotSignature slot : allSlots) {
            if (signedSlotIds.contains(slot.getId())) {
                signedSlots.add(slot);
            } else {
                missingSlots.add(slot);
            }
        }

        return new EnrollmentSignatureStatus(signedSlots, missingSlots);
    }

    public SignatureMatrixDto getSignatureMatrix(@PathVariable Long sessionId) {
        // 1. Load slots and enrollments
        List<SlotSignature> slots = slotRepository.findBySessionId(sessionId, Pageable.unpaged()).stream().toList();
        List<SessionEnrollment> enrollments = sessionEnrollmentRepository.findBySessionId(sessionId);

        // 2. Load all signatures for this session
        List<SignatureInfo> signatures = signatureRepository
                .findBySlotSignature_Session_Id(sessionId)
                .stream()
                .map(sig -> new SignatureInfo(sig.getSlotSignature().getId(), sig.getSessionEnrollment().getId()))
                .collect(Collectors.toList());

        // 3. Map to DTOs
        List<SlotDto> slotDtos = slots.stream()
                .map(s -> new SlotDto(s.getId(), s.getDateCreneau(), s.getPeriode()))
                .collect(Collectors.toList());

        List<EnrollmentDto> enrollmentDtos = enrollments.stream()
                .map(e -> new EnrollmentDto(e.getId(), e.getEmployee().getFirstName() + e.getEmployee().getLastName()))
                .collect(Collectors.toList());

        return new SignatureMatrixDto(slotDtos, enrollmentDtos, signatures);
    }

    public Page<SlotSignature> findAll(Long sessionId, Pageable pageable) {
        return slotRepository.findBySessionId(sessionId, pageable);
    }

    public SlotSignature findById(Long id) {
        return slotRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Slot not found"));
    }

    public SlotSignature ouvrirSignature(Long slotSignatureId) {
        SlotSignature slotSignature = findById(slotSignatureId);
        slotSignature.ouvrirSignature();
        return slotRepository.save(slotSignature);
    }

    public Page<SessionEnrollment> findMissingSignaturesForSlot(Long id, Pageable pageable) {
        SlotSignature slotSignature = findById(id);
        Session session = slotSignature.getSession();

        List<SessionEnrollment> enrollments = sessionEnrollmentRepository.findBySessionId(session.getId());

        List<SessionEnrollment> missingSlots = new ArrayList<>();

        for (SessionEnrollment enrollment : enrollments) {
            // vérifier s'il existe un couple {slotSignatureId, enrollmentID} dans les signature
            boolean exists = signatureRepository.existsBySlotSignatureAndSessionEnrollment(slotSignature, enrollment);
            if (!exists) {
                missingSlots.add(enrollment);
            }
        }
        return new PageImpl<>(missingSlots, pageable, enrollments.size());
    }

    public static record SlotDto(Long id,
                                 java.time.LocalDate date,
                                 SlotSignature.Periode period) {
    }

    public static record EnrollmentDto(Long id, String employeeName) {
    }

    public static record SignatureInfo(Long slotId, Long enrollmentId) {
    }

    public static record SignatureMatrixDto(
            List<SlotDto> slots,
            List<EnrollmentDto> enrollments,
            List<SignatureInfo> signatures
    ) {
    }
}
