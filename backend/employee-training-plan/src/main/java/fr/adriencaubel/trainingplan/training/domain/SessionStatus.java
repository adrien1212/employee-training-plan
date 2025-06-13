package fr.adriencaubel.trainingplan.training.domain;

import fr.adriencaubel.trainingplan.common.exception.DomainException;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

public enum SessionStatus {
    DRAFT,
    ACTIVE,
    COMPLETED,
    NOT_STARTED,
    CANCELLED;

    private static final Map<SessionStatus, Set<SessionStatus>> ALLOWED_TRANSITIONS = new EnumMap<>(SessionStatus.class);

    static {
        ALLOWED_TRANSITIONS.put(SessionStatus.DRAFT,
                EnumSet.of(SessionStatus.ACTIVE, SessionStatus.CANCELLED));
        ALLOWED_TRANSITIONS.put(SessionStatus.NOT_STARTED,
                EnumSet.of(SessionStatus.ACTIVE, SessionStatus.CANCELLED));
        ALLOWED_TRANSITIONS.put(SessionStatus.ACTIVE,
                EnumSet.of(SessionStatus.COMPLETED, SessionStatus.CANCELLED));
        ALLOWED_TRANSITIONS.put(SessionStatus.COMPLETED, EnumSet.noneOf(SessionStatus.class));
        ALLOWED_TRANSITIONS.put(SessionStatus.CANCELLED, EnumSet.noneOf(SessionStatus.class));
    }

    public static boolean canTransitionTo(SessionStatus current, SessionStatus newSessionStatus) {
        Set<SessionStatus> allowed = ALLOWED_TRANSITIONS.getOrDefault(current, EnumSet.noneOf(SessionStatus.class));
        if (!allowed.contains(newSessionStatus)) {
            String msg = String.format(
                    "Cannot change status from '%s' to '%s'. Allowed: %s",
                    current, newSessionStatus, allowed
            );
            throw new DomainException(msg);
        }
        return true;
    }
}
