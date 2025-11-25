package com.faculdade.customer_service_back.repository.ticket_repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.faculdade.customer_service_back.dto.projection.PriorityCount;
import com.faculdade.customer_service_back.dto.projection.StatusCount;
import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.model.ticket_model.TicketPriority;
import com.faculdade.customer_service_back.model.ticket_model.TicketStatus; // Import TicketStatus

public interface TicketRepository extends JpaRepository<TicketModel, Long> {

    @Query("SELECT t FROM TicketModel t WHERE t.status = 'OPEN' ORDER BY t.createdAt ASC")
    List<TicketModel> findOpenTickets();

    @Query("SELECT t FROM TicketModel t WHERE t.status = 'RESOLVED' ORDER BY t.resolvedAt DESC")
    List<TicketModel> findResolvedTickets();

    @Query("SELECT t.status as status, count(t) as count FROM TicketModel t GROUP BY t.status")
    List<StatusCount> countTicketsByStatus();

    @Query("SELECT t.priority as priority, count(t) as count FROM TicketModel t GROUP BY t.priority")
    List<PriorityCount> countTicketsByPriority();
}