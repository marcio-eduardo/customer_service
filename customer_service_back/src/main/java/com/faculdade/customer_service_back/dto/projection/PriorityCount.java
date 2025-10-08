package com.faculdade.customer_service_back.dto.projection;

import com.faculdade.customer_service_back.model.ticket_model.TicketPriority;

public interface PriorityCount {
    TicketPriority getPriority();
    Long getCount();
}
