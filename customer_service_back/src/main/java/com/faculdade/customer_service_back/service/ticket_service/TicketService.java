package com.faculdade.customer_service_back.service.ticket_service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.faculdade.customer_service_back.model.technical_model.Technical;
import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.model.ticket_model.TicketOpenRequest;
import com.faculdade.customer_service_back.model.ticket_model.TicketStatus;
import com.faculdade.customer_service_back.repository.technical_repository.TechnicalRepository;
import com.faculdade.customer_service_back.repository.ticket_repository.TicketRepository;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TechnicalRepository technicalRepository;

    //@Autowired
    public TicketService(TicketRepository ticketRepository, TechnicalRepository technicalRepository) {
        this.ticketRepository = ticketRepository;
        this.technicalRepository = technicalRepository;
    }

    // Método para abrir chamado
    public TicketModel openTicket(TicketOpenRequest request) {
        Technical technical = technicalRepository.findById(request.getTechnicalId())
                .orElseThrow(() -> new RuntimeException("Technical not found with ID: " + request.getTechnicalId()));

        TicketModel ticket = new TicketModel();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setTechnical(technical);
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    // Metodo para fechar chamado com detalhes de resolução
    public TicketModel closeTicket(Long ticketId, Long closedByTechnicalId, String resolutionNotes) {
        TicketModel ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + ticketId));

        Technical technical = technicalRepository.findById(closedByTechnicalId)
                .orElseThrow(() -> new RuntimeException("Technical not found with ID: " + closedByTechnicalId));

        ticket.setStatus(TicketStatus.RESOLVED);
        ticket.setResolvedAt(LocalDateTime.now());
        ticket.setClosedByTechnical(technical);
        ticket.setResolutionNotes(resolutionNotes);

        return ticketRepository.save(ticket);
    }

    // Metodo para buscar um chamado por ID
    public Optional<TicketModel> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    // Metodo para listar todos os chamados
    public List<TicketModel> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Metodo para listar chamados abertos
    public List<TicketModel> getOpenTickets() {
        return ticketRepository.findOpenTickets();
    }

    // Metodo para listar chamados fechados
    public List<TicketModel> getResolvedTickets() {
        return ticketRepository.findResolvedTickets();
    }
}