package com.faculdade.customer_service_back.controller.ticket_controller;

import com.faculdade.customer_service_back.service.ticket_service.TicketService;
import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.model.ticket_model.TicketOpenRequest;
import com.faculdade.customer_service_back.model.ticket_model.TicketCloseRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // Para controle de acesso baseado em roles
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // Endpoint para abrir um chamado
    @PostMapping("/open")
    @PreAuthorize("isAuthenticated()") // Qualquer utilizador autenticado pode abrir um chamado
    public ResponseEntity<TicketModel> openTicket(@RequestBody TicketOpenRequest request) {
        TicketModel ticket = ticketService.openTicket(request);
        return ResponseEntity.status(201).body(ticket);
    }

    // Endpoint para fechar um chamado com quem fechou e observações
    @PostMapping("/close")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')") // Apenas MODERATOR ou ADMIN podem fechar
    public ResponseEntity<TicketModel> closeTicket(@RequestBody TicketCloseRequest request) {
        TicketModel ticket = ticketService.closeTicket(request.getTicketId(), request.getClosedByTechnicalId(), request.getResolutionNotes());
        return ResponseEntity.ok(ticket);
    }

    // Endpoint para listar todos os chamados
    @GetMapping
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')") // Apenas MODERATOR ou ADMIN podem ver todos
    public ResponseEntity<List<TicketModel>> getAllTickets() {
        List<TicketModel> tickets = ticketService.getAllTickets();
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
    }

    // Endpoint para buscar chamado por ID
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()") // Autenticado pode ver detalhes se souber o ID (ajustar conforme necessário)
    public ResponseEntity<TicketModel> getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint para listar chamados abertos
    @GetMapping("/status/open")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')") // Apenas MODERATOR ou ADMIN podem ver a lista de abertos
    public ResponseEntity<List<TicketModel>> getOpenTickets() {
        List<TicketModel> tickets = ticketService.getOpenTickets();
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
    }

    // NOVO ENDPOINT para listar chamados resolvidos
    @GetMapping("/status/resolved")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')") // Apenas MODERATOR ou ADMIN podem ver a lista de resolvidos
    public ResponseEntity<List<TicketModel>> getResolvedTickets() {
        List<TicketModel> tickets = ticketService.getResolvedTickets();
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
    }
}
