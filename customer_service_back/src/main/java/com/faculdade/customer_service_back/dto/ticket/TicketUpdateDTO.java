package com.faculdade.customer_service_back.dto.ticket;

import com.faculdade.customer_service_back.model.ticket_model.TicketPriority;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TicketUpdateDTO {

    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    private String title;

    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;

    private TicketPriority priority;
}
