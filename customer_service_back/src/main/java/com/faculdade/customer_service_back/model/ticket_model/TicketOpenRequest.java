package com.faculdade.customer_service_back.model.ticket_model;

import lombok.Data;

@Data
public class TicketOpenRequest {

    private String title;
    private String description;
    private TicketPriority priority;

    private Long companyUserId;
    private Long companyId;

}
