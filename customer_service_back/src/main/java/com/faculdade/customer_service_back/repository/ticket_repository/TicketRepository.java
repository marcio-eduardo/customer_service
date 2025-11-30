package com.faculdade.customer_service_back.repository.ticket_repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.faculdade.customer_service_back.dto.projection.PriorityCount;
import com.faculdade.customer_service_back.dto.projection.StatusCount;
import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.model.ticket_model.TicketPriority;
import com.faculdade.customer_service_back.model.ticket_model.TicketStatus; // Import TicketStatus

public interface TicketRepository extends JpaRepository<TicketModel, Long> {

       @Query("SELECT t FROM TicketModel t " +
                     "LEFT JOIN FETCH t.company " +
                     "LEFT JOIN FETCH t.openedBy " +
                     "LEFT JOIN FETCH t.assignedTo " +
                     "ORDER BY t.createdAt DESC")
       List<TicketModel> findAllWithDetails();

       @Query("SELECT t FROM TicketModel t WHERE t.status = 'OPEN' ORDER BY t.createdAt ASC")
       List<TicketModel> findOpenTickets();

       @Query("SELECT t FROM TicketModel t WHERE t.status = 'RESOLVED' ORDER BY t.resolvedAt DESC")
       List<TicketModel> findResolvedTickets();

       @Query("SELECT t FROM TicketModel t " +
                     "LEFT JOIN FETCH t.company " +
                     "LEFT JOIN FETCH t.openedBy " +
                     "LEFT JOIN FETCH t.assignedTo " +
                     "WHERE t.status = 'OPEN' ORDER BY t.createdAt ASC")
       List<TicketModel> findOpenTicketsWithDetails();

       @Query("SELECT t FROM TicketModel t " +
                     "LEFT JOIN FETCH t.company " +
                     "LEFT JOIN FETCH t.openedBy " +
                     "LEFT JOIN FETCH t.assignedTo " +
                     "WHERE t.status = 'RESOLVED' ORDER BY t.resolvedAt DESC")
       List<TicketModel> findResolvedTicketsWithDetails();

       @Query("SELECT t FROM TicketModel t " +
                     "LEFT JOIN FETCH t.company " +
                     "LEFT JOIN FETCH t.openedBy " +
                     "LEFT JOIN FETCH t.assignedTo " +
                     "WHERE t.status = 'IN_PROGRESS' ORDER BY t.createdAt ASC")
       List<TicketModel> findInProgressTicketsWithDetails();

       @Query("SELECT t.status as status, count(t) as count FROM TicketModel t GROUP BY t.status")
       List<StatusCount> countTicketsByStatus();

       @Query("SELECT t.priority as priority, count(t) as count FROM TicketModel t GROUP BY t.priority")
       List<PriorityCount> countTicketsByPriority();

       @Query("SELECT t.status as status, count(t) as count FROM TicketModel t WHERE t.company.id = :companyId GROUP BY t.status")
       List<StatusCount> countTicketsByStatusAndCompanyId(@Param("companyId") Long companyId);

       @Query("SELECT t.priority as priority, count(t) as count FROM TicketModel t WHERE t.company.id = :companyId GROUP BY t.priority")
       List<PriorityCount> countTicketsByPriorityAndCompanyId(@Param("companyId") Long companyId);

       @Query("SELECT t FROM TicketModel t " +
                     "LEFT JOIN FETCH t.company " +
                     "LEFT JOIN FETCH t.openedBy " +
                     "LEFT JOIN FETCH t.assignedTo " +
                     "WHERE (:status IS NULL OR t.status = :status) " +
                     "AND (:companyId IS NULL OR t.company.id = :companyId) " +
                     "AND (:techId IS NULL OR t.assignedTo.id = :techId) " +
                     "ORDER BY t.createdAt DESC")
       List<TicketModel> findWithFilters(@Param("status") TicketStatus status,
                     @Param("companyId") Long companyId,
                     @Param("techId") Long techId);

       @Query("SELECT t FROM TicketModel t " +
                     "LEFT JOIN FETCH t.company " +
                     "LEFT JOIN FETCH t.openedBy " +
                     "LEFT JOIN FETCH t.assignedTo " +
                     "WHERE t.id = :id")
       Optional<TicketModel> findByIdWithDetails(@Param("id") Long id);
}