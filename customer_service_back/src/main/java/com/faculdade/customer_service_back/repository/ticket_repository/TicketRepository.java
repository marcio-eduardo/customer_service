package com.faculdade.customer_service_back.repository.ticket_repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.faculdade.customer_service_back.dto.projection.PriorityCount;
import com.faculdade.customer_service_back.dto.projection.StatusCount;
import com.faculdade.customer_service_back.model.ticket_model.TicketModel;

public interface TicketRepository extends JpaRepository<TicketModel, Long> {

    @Query("SELECT t FROM TicketModel t WHERE t.status = 'OPEN' ORDER BY t.createdAt ASC")
    List<TicketModel> findOpenTickets();

    @Query("SELECT t FROM TicketModel t WHERE t.status = 'RESOLVED' ORDER BY t.resolvedAt DESC")
    List<TicketModel> findResolvedTickets();

    @Query("SELECT t.status as status, count(t) as count FROM TicketModel t GROUP BY t.status")
    List<StatusCount> countTicketsByStatus();

    @Query("SELECT t.priority as priority, count(t) as count FROM TicketModel t GROUP BY t.priority")
    List<PriorityCount> countTicketsByPriority();

    List<TicketModel> findByCreatedById(Long companyUserId);

    List<TicketModel> findByCreatedByIdAndStatus(Long companyUserId, com.faculdade.customer_service_back.model.ticket_model.TicketStatus status);

    List<TicketModel> findByCompanyId(Long companyId);

    List<TicketModel> findByAssignedToId(Long adminUserId);

    List<TicketModel> findByAssignedToIdAndStatus(Long adminUserId, com.faculdade.customer_service_back.model.ticket_model.TicketStatus status);

    @Query("SELECT t FROM TicketModel t WHERE t.assignedTo.id = :adminUserId AND t.status = 'OPEN' ORDER BY t.priority DESC, t.createdAt ASC")
    List<TicketModel> findOpenTicketsByAdminOrderedByPriority(@Param("adminUserId") Long adminUserId);

    List<TicketModel> findByClosedById(Long adminUserId);
}