package com.faculdade.customer_service_back.service.ticket_service;

import com.faculdade.customer_service_back.dto.dashboard.DashboardStatsDTO;
import com.faculdade.customer_service_back.dto.projection.PriorityCount;
import com.faculdade.customer_service_back.dto.projection.StatusCount;
import com.faculdade.customer_service_back.dto.ticket.TicketCloseRequest;
import com.faculdade.customer_service_back.dto.ticket.TicketOpenRequest;
import com.faculdade.customer_service_back.model.company_model.Company;
import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.model.ticket_model.TicketPriority;
import com.faculdade.customer_service_back.model.ticket_model.TicketStatus;
import com.faculdade.customer_service_back.model.user_model.User;
import com.faculdade.customer_service_back.repository.company_repository.CompanyRepository;
import com.faculdade.customer_service_back.repository.ticket_repository.TicketRepository;
import com.faculdade.customer_service_back.repository.user_repository.UserRepository;
import com.faculdade.customer_service_back.security.services.UserDetailsImpl;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;

    public TicketService(TicketRepository ticketRepository, UserRepository userRepository, CompanyRepository companyRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
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
        long totalInProgressTickets = statusCounts.getOrDefault(TicketStatus.IN_PROGRESS, 0L);
        long totalUrgentTickets = priorityCounts.getOrDefault(TicketPriority.URGENTE, 0L);
        long totalHighPriorityTickets = priorityCounts.getOrDefault(TicketPriority.ALTA, 0L);
        long totalMediumPriorityTickets = priorityCounts.getOrDefault(TicketPriority.MEDIA, 0L);
        long totalLowPriorityTickets = priorityCounts.getOrDefault(TicketPriority.BAIXA, 0L);


        return new DashboardStatsDTO(
                statusCounts,
                priorityCounts,
                totalOpenTickets,
                totalResolvedTickets,
                totalInProgressTickets,
                totalUrgentTickets,
                totalHighPriorityTickets,
                totalMediumPriorityTickets,
                totalLowPriorityTickets
        );
    }

    public TicketModel openTicket(TicketOpenRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        TicketModel ticket = new TicketModel();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setCompany(company);
        ticket.setOpenedBy(user);

        return ticketRepository.save(ticket);
    }

    public TicketModel closeTicket(Long ticketId, TicketCloseRequest request) {
        TicketModel ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + ticketId));

        // TODO: check if the user has permission to close the ticket
        // For now, anyone can close any ticket

        ticket.setResolutionNotes(request.getResolutionNotes());
        ticket.setRating(request.getRating());
        ticket.setStatus(com.faculdade.customer_service_back.model.ticket_model.TicketStatus.RESOLVED);
        ticket.setResolvedAt(java.time.LocalDateTime.now());

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
