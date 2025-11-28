package com.faculdade.customer_service_back.controller.ticket_controller;

import com.faculdade.customer_service_back.dto.ticket.TicketAssignDTO;
import com.faculdade.customer_service_back.dto.ticket.TicketCloseDTO;
import com.faculdade.customer_service_back.dto.ticket.TicketCreateDTO;
import com.faculdade.customer_service_back.dto.ticket.TicketUpdateDTO;
import com.faculdade.customer_service_back.model.client_model.Company;
import com.faculdade.customer_service_back.model.client_model.CompanyUser;
import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.repository.client_repository.CompanyRepository;
import com.faculdade.customer_service_back.repository.client_repository.CompanyUserRepository;
import com.faculdade.customer_service_back.service.ticket_service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private CompanyUserRepository companyUserRepository;

    @PostMapping("/open")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR')")
    public ResponseEntity<?> openTicket(@Valid @RequestBody TicketCreateDTO dto) {
        try {
            CompanyUser companyUser = companyUserRepository.findById(dto.getCompanyUserId())
                    .orElseThrow(() -> new RuntimeException("CompanyUser not found with ID: " + dto.getCompanyUserId()));

            TicketModel ticket = new TicketModel();
            ticket.setTitle(dto.getTitle());
            ticket.setDescription(dto.getDescription());
            ticket.setPriority(dto.getPriority());
            ticket.setCreatedBy(companyUser);
            ticket.setCompany(companyUser.getCompany());
            ticket.setCreatedAt(LocalDateTime.now());

            TicketModel saved = ticketService.openTicket(ticket);
            return ResponseEntity.status(201).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating ticket: " + e.getMessage());
        }
    }

    @PostMapping("/close")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<?> closeTicket(@Valid @RequestBody TicketCloseDTO dto) {
        try {
            TicketModel ticket = ticketService.closeTicket(
                    dto.getTicketId(),
                    dto.getAdminUserId(),
                    dto.getResolutionNotes()
            );
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error closing ticket: " + e.getMessage());
        }
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<?> assignTicket(@Valid @RequestBody TicketAssignDTO dto) {
        try {
            TicketModel ticket = ticketService.assignTicketToAdmin(
                    dto.getTicketId(),
                    dto.getAdminUserId()
            );
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error assigning ticket: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR')")
    public ResponseEntity<?> updateTicket(@PathVariable Long id, @Valid @RequestBody TicketUpdateDTO dto) {
        try {
            TicketModel ticket = ticketService.getTicketById(id)
                    .orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + id));

            if (dto.getTitle() != null) {
                ticket.setTitle(dto.getTitle());
            }
            if (dto.getDescription() != null) {
                ticket.setDescription(dto.getDescription());
            }
            if (dto.getPriority() != null) {
                ticket.setPriority(dto.getPriority());
            }

            TicketModel updated = ticketService.updateTicket(ticket);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating ticket: " + e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<TicketModel>> getAllTickets() {
        List<TicketModel> tickets = ticketService.getAllTickets();
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketModel> getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/status/open")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<TicketModel>> getOpenTickets() {
        List<TicketModel> tickets = ticketService.getOpenTickets();
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
    }

    @GetMapping("/status/resolved")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<TicketModel>> getResolvedTickets() {
        List<TicketModel> tickets = ticketService.getResolvedTickets();
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
    }

    @GetMapping("/company-user/{companyUserId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR')")
    public ResponseEntity<List<TicketModel>> getTicketsByCompanyUser(@PathVariable Long companyUserId) {
        List<TicketModel> tickets = ticketService.getTicketsByCompanyUserId(companyUserId);
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
    }

    @GetMapping("/admin-user/{adminUserId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<TicketModel>> getTicketsByAdminUser(@PathVariable Long adminUserId) {
        List<TicketModel> tickets = ticketService.getTicketsByAdminUserId(adminUserId);
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
    }

    @GetMapping("/admin-user/{adminUserId}/open-priority")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<TicketModel>> getOpenTicketsByPriority(@PathVariable Long adminUserId) {
        List<TicketModel> tickets = ticketService.getOpenTicketsByAdminOrderedByPriority(adminUserId);
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
    }
}
