package com.faculdade.customer_service_back.service.ticket_service;

import com.faculdade.customer_service_back.dto.DashboardStatsDTO;
import com.faculdade.customer_service_back.dto.projection.PriorityCount;
import com.faculdade.customer_service_back.dto.projection.StatusCount;
import com.faculdade.customer_service_back.model.client_model.ClientePf;
import com.faculdade.customer_service_back.model.client_model.ClientePJ;
import com.faculdade.customer_service_back.model.technical_model.Technical;
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
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TechnicalRepository technicalRepository;
    private final ClientePfRepository clientePfRepository;
    private final ClientePJRepository clientePjRepository;

    public TicketService(TicketRepository ticketRepository,
                         TechnicalRepository technicalRepository,
                         ClientePfRepository clientePfRepository,
                         ClientePJRepository clientePjRepository) {
        this.ticketRepository = ticketRepository;
        this.technicalRepository = technicalRepository;
        this.clientePfRepository = clientePfRepository;
        this.clientePjRepository = clientePjRepository;
    }

    public DashboardStatsDTO getDashboardStats() {
        List<StatusCount> statusCountsList = ticketRepository.countTicketsByStatus();
        List<PriorityCount> priorityCountsList = ticketRepository.countTicketsByPriority();

        Map<TicketStatus, Long> statusCounts = statusCountsList.stream()
                .collect(Collectors.toMap(StatusCount::getStatus, StatusCount::getCount));

        for (TicketStatus status : TicketStatus.values()) {
            statusCounts.putIfAbsent(status, 0L);
        }

        Map<TicketPriority, Long> priorityCounts = priorityCountsList.stream()
                .collect(Collectors.toMap(PriorityCount::getPriority, PriorityCount::getCount));
        
        for (TicketPriority priority : TicketPriority.values()) {
            priorityCounts.putIfAbsent(priority, 0L);
        }

        long totalOpenTickets = statusCounts.getOrDefault(TicketStatus.OPEN, 0L);
        long totalResolvedTickets = statusCounts.getOrDefault(TicketStatus.RESOLVED, 0L);

        return new DashboardStatsDTO(statusCounts, priorityCounts, totalOpenTickets, totalResolvedTickets);
    }

    public TicketModel openTicket(TicketOpenRequest request) {
        TicketModel ticket = new TicketModel();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());

        if (request.getClientePfId() != null) {
            ClientePf cliente = clientePfRepository.findById(request.getClientePfId())
                    .orElseThrow(() -> new RuntimeException("Cliente PF nao encontrado com o ID: " + request.getClientePfId()));
            ticket.setClientePf(cliente);
        } else if (request.getClientePjId() != null) {
            ClientePJ cliente = clientePjRepository.findById(request.getClientePjId())
                    .orElseThrow(() -> new RuntimeException("Cliente PJ nao encontrado com o ID: " + request.getClientePjId()));
            ticket.setClientePj(cliente);
        } else {
            throw new IllegalArgumentException("É necessário fornecer o ID de um Cliente PF ou PJ para abrir um chamado.");
        }

        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

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
}