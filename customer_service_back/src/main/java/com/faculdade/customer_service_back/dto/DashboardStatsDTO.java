package com.faculdade.customer_service_back.dto;

import com.faculdade.customer_service_back.model.ticket_model.TicketPriority;
import com.faculdade.customer_service_back.model.ticket_model.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Map<TicketStatus, Long> statusCounts;
    private Map<TicketPriority, Long> priorityCounts;
    private long totalOpenTickets;
    private long totalResolvedTickets;
}
