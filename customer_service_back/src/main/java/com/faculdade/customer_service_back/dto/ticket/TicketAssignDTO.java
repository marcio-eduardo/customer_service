package com.faculdade.customer_service_back.dto.ticket;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketAssignDTO {

    @NotNull(message = "Ticket ID is required")
    private Long ticketId;

    @NotNull(message = "AdminUser ID is required")
    private Long adminUserId;
}
