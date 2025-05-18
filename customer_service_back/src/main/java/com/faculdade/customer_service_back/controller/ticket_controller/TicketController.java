/*package com.faculdade.customer_service_back.controller.ticket_controller;

import com.faculdade.customer_service_back.service.ticket_service.TicketService;
import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.model.ticket_model.TicketOpenRequest;
import com.faculdade.customer_service_back.model.ticket_model.TicketCloseRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // Endpoint para abrir um chamado
    @PostMapping("/open")
    public ResponseEntity<TicketModel> openTicket(@RequestBody TicketOpenRequest request) {
        TicketModel ticket = ticketService.openTicket(request);
        return ResponseEntity.status(201).body(ticket);
    }

    // Endpoint para fechar um chamado
    @PostMapping("/close")
    public ResponseEntity<TicketModel> closeTicket(@RequestBody TicketCloseRequest request) {
        TicketModel ticket = ticketService.closeTicket(request);
        return ResponseEntity.ok(ticket);
    }

    // Endpoint para listar todos os chamados
    @GetMapping
    public ResponseEntity<List<TicketModel>> getAllTickets() {
        List<TicketModel> tickets = ticketService.getAllTickets();

        if (tickets.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(tickets);
    }

    // Endpoint para buscar chamado por ID
    @GetMapping("/{id}")
    public ResponseEntity<TicketModel> getTicketById(@PathVariable Long id) {
        Optional<TicketModel> ticket = Optional.ofNullable(ticketService.getTicketById(id));

        return ticket.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}*/

package com.faculdade.customer_service_back.controller.ticket_controller;

import com.faculdade.customer_service_back.service.ticket_service.TicketService;
import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.model.ticket_model.TicketOpenRequest;
import com.faculdade.customer_service_back.model.ticket_model.TicketCloseRequest;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<TicketModel> openTicket(@RequestBody TicketOpenRequest request) {
        TicketModel ticket = ticketService.openTicket(request);
        return ResponseEntity.status(201).body(ticket);
    }

    // Endpoint para fechar um chamado com quem fechou e observações
    @PostMapping("/close")
    public ResponseEntity<TicketModel> closeTicket(@RequestBody TicketCloseRequest request) {
        TicketModel ticket = ticketService.closeTicket(request.getTicketId(), request.getClosedByTechnicalId(), request.getResolutionNotes());
        return ResponseEntity.ok(ticket);
    }

    // Endpoint para listar todos os chamados
    @GetMapping
    public ResponseEntity<List<TicketModel>> getAllTickets() {
        List<TicketModel> tickets = ticketService.getAllTickets();

        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
    }

    // Endpoint para buscar chamado por ID
    @GetMapping("/{id}")
    public ResponseEntity<TicketModel> getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

