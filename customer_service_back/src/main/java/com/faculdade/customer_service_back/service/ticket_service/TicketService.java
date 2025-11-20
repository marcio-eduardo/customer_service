package com.faculdade.customer_service_back.service.ticket_service;

import com.faculdade.customer_service_back.dto.dashboard.DashboardStatsDTO;
import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.model.ticket_model.TicketOpenRequest;
import com.faculdade.customer_service_back.model.ticket_model.TicketPriority;
import com.faculdade.customer_service_back.model.ticket_model.TicketStatus;
import com.faculdade.customer_service_back.repository.client_repository.ClientePfRepository;
import com.faculdade.customer_service_back.repository.client_repository.ClientePJRepository;
import com.faculdade.customer_service_back.repository.technical_repository.TechnicalRepository;
import com.faculdade.customer_service_back.repository.ticket_repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final ClientePfRepository clientePfRepository;
    private final ClientePJRepository clientePjRepository;
    private final TechnicalRepository technicalRepository;

    public TicketService(TicketRepository ticketRepository,
                         ClientePfRepository clientePfRepository,
                         ClientePJRepository clientePjRepository,
                         TechnicalRepository technicalRepository) {
        this.ticketRepository = ticketRepository;
        this.clientePfRepository = clientePfRepository;
        this.clientePjRepository = clientePjRepository;
        this.technicalRepository = technicalRepository;
    }

    public TicketModel openTicket(TicketOpenRequest request) {
        TicketModel ticket = new TicketModel();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());

        // Lógica para associar o cliente (PF ou PJ)
        if (request.getClientePfId() != null) {
            clientePfRepository.findById(request.getClientePfId()).ifPresent(ticket::setClientePf);
        } else if (request.getClientePjId() != null) {
            clientePjRepository.findById(request.getClientePjId()).ifPresent(ticket::setClientePj);
        }

        // A atribuição inicial a um técnico foi removida. O ticket é criado sem técnico.
        // ticket.setTechnical(technical);
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    public TicketModel closeTicket(Long ticketId, Long closedByTechnicalId, String resolutionNotes) {
        TicketModel ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + ticketId));

        technicalRepository.findById(closedByTechnicalId).ifPresent(ticket::setClosedByTechnical);

        ticket.setStatus(TicketStatus.RESOLVED);
        ticket.setResolvedAt(LocalDateTime.now());
        ticket.setResolutionNotes(resolutionNotes);

        return ticketRepository.save(ticket);
    }

    public Optional<TicketModel> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    public List<TicketModel> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<TicketModel> getOpenTickets() {
        return ticketRepository.findOpenTickets();
    }

    public List<TicketModel> getResolvedTickets() {
        return ticketRepository.findResolvedTickets();
    }

    public DashboardStatsDTO getDashboardStats() {
        // Contagens por status
        long totalOpen = ticketRepository.countByStatus(TicketStatus.OPEN);
        long totalResolved = ticketRepository.countByStatus(TicketStatus.RESOLVED);
        long totalInProgress = ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);

        // Contagens por prioridade
        long totalUrgent = ticketRepository.countByPriority(TicketPriority.URGENT);
        long totalHigh = ticketRepository.countByPriority(TicketPriority.HIGH);
        long totalMedium = ticketRepository.countByPriority(TicketPriority.MEDIUM);
        long totalLow = ticketRepository.countByPriority(TicketPriority.LOW);

        return new DashboardStatsDTO(
            totalOpen,
            totalResolved,
            totalInProgress,
            totalUrgent,
            totalHigh,
            totalMedium,
            totalLow
        );
    }
}
