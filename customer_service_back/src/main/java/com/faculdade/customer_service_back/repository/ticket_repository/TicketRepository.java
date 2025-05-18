package com.faculdade.customer_service_back.repository.ticket_repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.faculdade.customer_service_back.model.ticket_model.TicketModel;

public interface TicketRepository extends JpaRepository<TicketModel, Long> {

    @Query("SELECT t FROM TicketModel t WHERE t.status = 'OPEN' ORDER BY t.createdAt ASC")
    List<TicketModel> findOpenTickets();

    @Query("SELECT t FROM TicketModel t WHERE t.status = 'RESOLVED' ORDER BY t.resolvedAt DESC")
    List<TicketModel> findResolvedTickets();
}