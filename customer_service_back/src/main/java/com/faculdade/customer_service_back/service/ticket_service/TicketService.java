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
                    .orElseThrow(() -> new RuntimeException("Requester not found with id: " + request.getRequesterId()));
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
        }

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


    public Optional<com.faculdade.customer_service_back.dto.ticket.TicketResponse> getTicketById(Long id) {
        return ticketRepository.findByIdWithDetails(id)
                .map(com.faculdade.customer_service_back.dto.ticket.TicketResponse::new);
    }

    public List<TicketResponse> getAllTickets() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByIdWithCompany(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<TicketModel> tickets = ticketRepository.findAllWithDetails();
        
        // Se for usuário de empresa, retornar apenas tickets da sua empresa
        if (currentUser.getCompany() != null && 
            !currentUser.getRoles().stream().anyMatch(role -> 
                role.getName().equals(ERole.ROLE_MODERATOR) ||
                role.getName().equals(ERole.ROLE_COMPANY_USER) ||
                role.getName().equals(ERole.ROLE_TECH_USER))) {
            return tickets.stream()
                    .filter(ticket -> ticket.getCompany() != null && 
                            ticket.getCompany().getId().equals(currentUser.getCompany().getId()))
                    .map(TicketResponse::new)
                    .collect(java.util.stream.Collectors.toList());
        }
        
        return tickets.stream()
                .map(TicketResponse::new)
                .collect(java.util.stream.Collectors.toList());
    }

    public List<TicketResponse> getOpenTickets() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByIdWithCompany(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<TicketModel> openTickets = ticketRepository.findOpenTicketsWithDetails();
        
        // Se for usuário de empresa, filtrar apenas tickets da sua empresa
        if (currentUser.getCompany() != null && 
            !currentUser.getRoles().stream().anyMatch(role -> 
                role.getName().equals(ERole.ROLE_MODERATOR) ||
                role.getName().equals(ERole.ROLE_COMPANY_USER) ||
                role.getName().equals(ERole.ROLE_TECH_USER))) {
            return openTickets.stream()
                    .filter(ticket -> ticket.getCompany() != null && 
                            ticket.getCompany().getId().equals(currentUser.getCompany().getId()))
                    .map(TicketResponse::new)
                    .collect(java.util.stream.Collectors.toList());
        }
        
        return openTickets.stream()
                .map(TicketResponse::new)
                .collect(java.util.stream.Collectors.toList());
    }

    public List<TicketResponse> getResolvedTickets() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByIdWithCompany(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<TicketModel> resolvedTickets = ticketRepository.findResolvedTicketsWithDetails();
        
        // Se for usuário de empresa, filtrar apenas tickets da sua empresa
        if (currentUser.getCompany() != null && 
            !currentUser.getRoles().stream().anyMatch(role -> 
                role.getName().equals(ERole.ROLE_MODERATOR) ||
                role.getName().equals(ERole.ROLE_COMPANY_USER) ||
                role.getName().equals(ERole.ROLE_TECH_USER))) {
            return resolvedTickets.stream()
                    .filter(ticket -> ticket.getCompany() != null && 
                            ticket.getCompany().getId().equals(currentUser.getCompany().getId()))
                    .map(TicketResponse::new)
                    .collect(java.util.stream.Collectors.toList());
        }
        
        return resolvedTickets.stream()
                .map(TicketResponse::new)
                .collect(java.util.stream.Collectors.toList());
    }
}
