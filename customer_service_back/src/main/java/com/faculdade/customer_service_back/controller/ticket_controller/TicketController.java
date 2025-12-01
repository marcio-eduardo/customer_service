package com.faculdade.customer_service_back.controller.ticket_controller;

import com.faculdade.customer_service_back.dto.ticket.EscalationRequest;
import com.faculdade.customer_service_back.dto.ticket.TicketCloseRequest;
import com.faculdade.customer_service_back.dto.ticket.TicketOpenRequest;
import com.faculdade.customer_service_back.dto.ticket.TicketResponse;
import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.model.ticket_model.TicketStatus;
import com.faculdade.customer_service_back.service.ticket_service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<TicketResponse> openTicket(@RequestBody TicketOpenRequest request) {
        TicketModel ticket = ticketService.openTicket(request);
        return ResponseEntity.status(201).body(new TicketResponse(ticket));
    }

    @PostMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('ROLE_MODERATOR', 'ROLE_TECH_USER')")
    public ResponseEntity<TicketResponse> closeTicket(@PathVariable Long id, @RequestBody TicketCloseRequest request) {
        TicketModel ticket = ticketService.closeTicket(id, request);
        return ResponseEntity.ok(new TicketResponse(ticket));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ROLE_MODERATOR', 'ROLE_TECH_USER')")
    public ResponseEntity<TicketResponse> assignTicket(@PathVariable Long id) {
        TicketModel ticket = ticketService.assignTicket(id);
        return ResponseEntity.ok(new TicketResponse(ticket));
    }

    @PatchMapping("/{id}/pause")
    @PreAuthorize("hasRole('ROLE_MODERATOR')")
    public ResponseEntity<TicketResponse> pauseTicket(@PathVariable Long id) {
        TicketModel ticket = ticketService.pauseTicket(id);
        return ResponseEntity.ok(new TicketResponse(ticket));
    }

    @PatchMapping("/{id}/escalate")
    @PreAuthorize("hasRole('ROLE_TECH_USER')")
    public ResponseEntity<TicketResponse> escalateTicket(@PathVariable Long id,
            @RequestBody @Valid EscalationRequest request) {
        TicketModel ticket = ticketService.escalateTicket(id, request.getModeratorId());
        return ResponseEntity.ok(new TicketResponse(ticket));
    }

    @PatchMapping("/{id}/reassign")
    @PreAuthorize("hasRole('ROLE_MODERATOR')")
    public ResponseEntity<TicketResponse> reassignTicket(@PathVariable Long id, @RequestBody Long newTechId) {
        TicketModel ticket = ticketService.reassignTicket(id, newTechId);
        return ResponseEntity.ok(new TicketResponse(ticket));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ROLE_MODERATOR')")
    public ResponseEntity<TicketResponse> cancelTicket(@PathVariable Long id) {
        TicketModel ticket = ticketService.cancelTicket(id);
        return ResponseEntity.ok(new TicketResponse(ticket));
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TicketResponse>> searchTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) Long techId) {
        List<TicketResponse> tickets = ticketService.searchTickets(status, companyId, techId);
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
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

    @GetMapping("/status/in-progress")
    @PreAuthorize("hasAnyRole('ROLE_MODERATOR', 'ROLE_TECH_USER')")
    public ResponseEntity<List<TicketResponse>> getInProgressTickets() {
        List<TicketResponse> tickets = ticketService.getInProgressTickets();
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
    }

    @GetMapping("/status/resolved")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TicketResponse>> getResolvedTickets() {
        List<TicketResponse> tickets = ticketService.getResolvedTickets();
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
    }

    @PostMapping("/fix-slas")
    @PreAuthorize("hasAnyRole('ROLE_MODERATOR', 'ROLE_TECH_USER')")
    public ResponseEntity<Void> fixSlaDates() {
        ticketService.fixSlaDates();
        return ResponseEntity.ok().build();
    }
}
