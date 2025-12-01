package com.faculdade.customer_service_back.dto.ticket;

import jakarta.validation.constraints.NotNull;

public class EscalationRequest {
    @NotNull(message = "O ID do moderador é obrigatório.")
    private Long moderatorId;

    public Long getModeratorId() {
        return moderatorId;
    }

    public void setModeratorId(Long moderatorId) {
        this.moderatorId = moderatorId;
    }
}
