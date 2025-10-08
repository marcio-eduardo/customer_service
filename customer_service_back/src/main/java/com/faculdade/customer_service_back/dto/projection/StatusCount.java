package com.faculdade.customer_service_back.dto.projection;

import com.faculdade.customer_service_back.model.ticket_model.TicketStatus;

public interface StatusCount {
    TicketStatus getStatus();
    Long getCount();
}
