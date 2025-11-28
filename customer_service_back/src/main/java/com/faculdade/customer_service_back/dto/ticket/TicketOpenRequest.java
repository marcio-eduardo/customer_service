package com.faculdade.customer_service_back.dto.ticket;

import com.faculdade.customer_service_back.model.ticket_model.TicketPriority;
import lombok.Data;

@Data
public class TicketOpenRequest {

    private String title;
    private String description;
    private TicketPriority priority;
    private Long companyId;
}
