package com.faculdade.customer_service_back.dto.ticket;

import lombok.Data;

@Data
public class TicketCloseRequest {

    private String resolutionNotes;
    private Integer rating;
}
