package com.faculdade.customer_service_back.model.ticket_model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TicketCloseRequest {
    private Long ticketId;          // ID do chamado a ser fechado
    private Long closedByTechnicalId;  // ID do técnico que fechou o chamado
    private String resolutionNotes; // Observações sobre a resolução
}