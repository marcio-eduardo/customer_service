package com.faculdade.customer_service_back.controller.ticket_controller;

import com.faculdade.customer_service_back.dto.ticket.TicketCloseRequest;
import com.faculdade.customer_service_back.dto.ticket.TicketOpenRequest;
import com.faculdade.customer_service_back.dto.ticket.TicketResponse;
import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.service.ticket_service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping("/open")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketModel> openTicket(@RequestBody TicketOpenRequest request) {
        TicketModel ticket = ticketService.openTicket(request);
        return ResponseEntity.status(201).body(ticket);
    }

    @PostMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('ROLE_MODERATOR', 'ROLE_TECH_USER')")
    public ResponseEntity<TicketModel> closeTicket(@PathVariable Long id, @RequestBody TicketCloseRequest request) {
        TicketModel ticket = ticketService.closeTicket(id, request);
        return ResponseEntity.ok(ticket);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_MODERATOR', 'ROLE_TECH_USER')")
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        List<TicketResponse> tickets = ticketService.getAllTickets();
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/status/open")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TicketResponse>> getOpenTickets() {
        List<TicketResponse> tickets = ticketService.getOpenTickets();
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
    }

    @GetMapping("/status/resolved")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TicketResponse>> getResolvedTickets() {
        List<TicketResponse> tickets = ticketService.getResolvedTickets();
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
    }
}
