package com.faculdade.customer_service_back.dto.ticket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TicketCloseDTO {

    @NotNull(message = "Ticket ID is required")
    private Long ticketId;

    @NotNull(message = "AdminUser ID is required")
    private Long adminUserId;

    @NotBlank(message = "Resolution notes are required")
    @Size(min = 10, max = 500, message = "Resolution notes must be between 10 and 500 characters")
    private String resolutionNotes;
}
