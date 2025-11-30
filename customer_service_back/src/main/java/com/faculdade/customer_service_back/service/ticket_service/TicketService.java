package com.faculdade.customer_service_back.service.ticket_service;

import com.faculdade.customer_service_back.dto.dashboard.DashboardStatsDTO;
import com.faculdade.customer_service_back.dto.projection.PriorityCount;
import com.faculdade.customer_service_back.dto.projection.StatusCount;
import com.faculdade.customer_service_back.dto.ticket.TicketCloseRequest;
import com.faculdade.customer_service_back.dto.ticket.TicketOpenRequest;
import com.faculdade.customer_service_back.dto.ticket.TicketResponse;
import com.faculdade.customer_service_back.model.company_model.Company;
import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.model.ticket_model.TicketPriority;
import com.faculdade.customer_service_back.model.ticket_model.TicketStatus;
import com.faculdade.customer_service_back.model.user_model.ERole;
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

    public TicketService(TicketRepository ticketRepository, UserRepository userRepository,
            CompanyRepository companyRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
    }

    public DashboardStatsDTO getDashboardStats() {
        User currentUser = getCurrentUser();
        List<StatusCount> statusCountsList;
        List<PriorityCount> priorityCountsList;

        if (currentUser.getCompany() != null) {
            Long companyId = currentUser.getCompany().getId();
            statusCountsList = ticketRepository.countTicketsByStatusAndCompanyId(companyId);
            priorityCountsList = ticketRepository.countTicketsByPriorityAndCompanyId(companyId);
        } else {
            statusCountsList = ticketRepository.countTicketsByStatus();
            priorityCountsList = ticketRepository.countTicketsByPriority();
        }

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
                totalLowPriorityTickets);
    }

    public TicketModel openTicket(TicketOpenRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        User currentUser = userRepository.findByIdWithCompany(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = null;
        if (request.getCompanyId() != null && request.getCompanyId() > 0) {
            company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new RuntimeException("Company not found with id: " + request.getCompanyId()));
        } else {
            if (currentUser.getCompany() != null) {
                company = currentUser.getCompany();
            } else {
                throw new RuntimeException("Usuário não possui empresa vinculada e nenhuma empresa foi especificada");
            }
        }

        User requester;
        if (request.getRequesterId() != null) {
            requester = userRepository.findById(request.getRequesterId())
                    .orElseThrow(
                            () -> new RuntimeException("Requester not found with id: " + request.getRequesterId()));
        } else {
            requester = currentUser;
        }

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found with id: " + request.getAssigneeId()));
        }

        TicketModel ticket = new TicketModel();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority() != null ? request.getPriority() : TicketPriority.MEDIA);
        ticket.setCompany(company);
        ticket.setOpenedBy(requester);
        if (assignee != null) {
            ticket.setAssignedTo(assignee);
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }

        return ticketRepository.save(ticket);
    }

    public TicketModel closeTicket(Long ticketId, TicketCloseRequest request) {
        TicketModel ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + ticketId));

        if (ticket.getStatus() != TicketStatus.IN_PROGRESS) {
            throw new RuntimeException("Apenas chamados em atendimento podem ser encerrados.");
        }

        ticket.setResolutionNotes(request.getResolutionNotes());
        ticket.setRating(request.getRating());
        ticket.setStatus(TicketStatus.RESOLVED);
        ticket.setResolvedAt(java.time.LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    public List<TicketResponse> getInProgressTickets() {
        User currentUser = getCurrentUser();
        List<TicketModel> inProgressTickets = ticketRepository.findInProgressTicketsWithDetails();
        return filterTicketsForUser(inProgressTickets, currentUser);
    }

    public TicketModel assignTicket(Long ticketId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TicketModel ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + ticketId));

        if (ticket.getAssignedTo() != null) {
            throw new RuntimeException("Ticket already assigned to: " + ticket.getAssignedTo().getUsername());
        }

        ticket.setAssignedTo(currentUser);
        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }

        return ticketRepository.save(ticket);
    }

    public Optional<TicketResponse> getTicketById(Long id) {
        return ticketRepository.findByIdWithDetails(id)
                .map(TicketResponse::new);
    }

    public List<TicketResponse> getAllTickets() {
        User currentUser = getCurrentUser();
        List<TicketModel> tickets = ticketRepository.findAllWithDetails();
        return filterTicketsForUser(tickets, currentUser);
    }

    public List<TicketResponse> getOpenTickets() {
        User currentUser = getCurrentUser();
        List<TicketModel> openTickets = ticketRepository.findOpenTicketsWithDetails();
        return filterTicketsForUser(openTickets, currentUser);
    }

    public List<TicketResponse> getResolvedTickets() {
        User currentUser = getCurrentUser();
        List<TicketModel> resolvedTickets = ticketRepository.findResolvedTicketsWithDetails();
        return filterTicketsForUser(resolvedTickets, currentUser);
    }

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        return userRepository.findByIdWithCompany(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private List<TicketResponse> filterTicketsForUser(List<TicketModel> tickets, User user) {
        // Se for Moderador ou Técnico, vê tudo
        boolean canSeeAll = user.getRoles().stream().anyMatch(role -> role.getName().equals(ERole.ROLE_MODERATOR) ||
                role.getName().equals(ERole.ROLE_TECH_USER));

        if (canSeeAll) {
            return tickets.stream()
                    .map(TicketResponse::new)
                    .collect(Collectors.toList());
        }

        // Se for usuário de empresa (ROLE_COMPANY_USER ou apenas vinculado a uma
        // empresa), vê apenas tickets da empresa
        if (user.getCompany() != null) {
            return tickets.stream()
                    .filter(ticket -> ticket.getCompany() != null &&
                            ticket.getCompany().getId().equals(user.getCompany().getId()))
                    .map(TicketResponse::new)
                    .collect(Collectors.toList());
        }

        // Fallback: se não tem empresa e não é admin/tech, retorna apenas seus próprios
        // tickets
        return tickets.stream()
                .filter(ticket -> ticket.getOpenedBy().getId().equals(user.getId()))
                .map(TicketResponse::new)
                .collect(Collectors.toList());
    }
}
