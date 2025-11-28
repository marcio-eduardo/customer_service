package com.faculdade.customer_service_back.service.ticket_service;

import com.faculdade.customer_service_back.dto.DashboardStatsDTO;
import com.faculdade.customer_service_back.dto.projection.PriorityCount;
import com.faculdade.customer_service_back.dto.projection.StatusCount;
import com.faculdade.customer_service_back.model.admin_model.AdminUser;
import com.faculdade.customer_service_back.model.client_model.Company;
import com.faculdade.customer_service_back.model.client_model.CompanyUser;
import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.model.ticket_model.TicketOpenRequest;
import com.faculdade.customer_service_back.model.ticket_model.TicketPriority;
import com.faculdade.customer_service_back.model.ticket_model.TicketStatus;
import com.faculdade.customer_service_back.repository.admin_repository.AdminUserRepository;
import com.faculdade.customer_service_back.repository.client_repository.CompanyRepository;
import com.faculdade.customer_service_back.repository.client_repository.CompanyUserRepository;
import com.faculdade.customer_service_back.repository.ticket_repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final AdminUserRepository adminUserRepository;
    private final CompanyUserRepository companyUserRepository;
    private final CompanyRepository companyRepository;

    public TicketService(TicketRepository ticketRepository,
                         AdminUserRepository adminUserRepository,
                         CompanyUserRepository companyUserRepository,
                         CompanyRepository companyRepository) {
        this.ticketRepository = ticketRepository;
        this.adminUserRepository = adminUserRepository;
        this.companyUserRepository = companyUserRepository;
        this.companyRepository = companyRepository;
    }

    @Transactional(readOnly = true)
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

    @Transactional
    public TicketModel openTicket(TicketOpenRequest request) {
        TicketModel ticket = new TicketModel();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());

        if (request.getCompanyUserId() != null) {
            CompanyUser user = companyUserRepository.findById(request.getCompanyUserId())
                    .orElseThrow(() -> new RuntimeException("CompanyUser not found with ID: " + request.getCompanyUserId()));
            ticket.setCreatedBy(user);
            ticket.setCompany(user.getCompany());
        } else if (request.getCompanyId() != null) {
            Company company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new RuntimeException("Company not found with ID: " + request.getCompanyId()));
            ticket.setCompany(company);
            // Assume que o responsável da empresa está criando o ticket
            ticket.setCreatedBy(company.getResponsible());
        } else {
            throw new IllegalArgumentException("A CompanyUser ID or a Company ID must be provided to open a ticket.");
        }

        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    @Transactional
    public TicketModel closeTicket(Long ticketId, Long closedByAdminUserId, String resolutionNotes) {
        TicketModel ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + ticketId));

        AdminUser adminUser = adminUserRepository.findById(closedByAdminUserId)
                .orElseThrow(() -> new RuntimeException("AdminUser not found with ID: " + closedByAdminUserId));

        ticket.setStatus(TicketStatus.RESOLVED);
        ticket.setResolvedAt(LocalDateTime.now());
        ticket.setClosedBy(adminUser);
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

    @Transactional(readOnly = true)
    public List<TicketModel> getResolvedTickets() {
        return ticketRepository.findResolvedTickets();
    }

    @Transactional(readOnly = true)
    public List<TicketModel> getTicketsByCompanyUserId(Long companyUserId) {
        return ticketRepository.findByCreatedById(companyUserId);
    }

    @Transactional(readOnly = true)
    public List<TicketModel> getTicketsByAdminUserId(Long adminUserId) {
        return ticketRepository.findByAssignedToId(adminUserId);
    }

    @Transactional(readOnly = true)
    public List<TicketModel> getOpenTicketsByAdminOrderedByPriority(Long adminUserId) {
        return ticketRepository.findOpenTicketsByAdminOrderedByPriority(adminUserId);
    }

    @Transactional
    public TicketModel assignTicketToAdmin(Long ticketId, Long adminUserId) {
        TicketModel ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + ticketId));

        AdminUser adminUser = adminUserRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("AdminUser not found with ID: " + adminUserId));

        ticket.setAssignedTo(adminUser);
        return ticketRepository.save(ticket);
    }

    @Transactional
    public TicketModel openTicket(TicketModel ticket) {
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setOpenDate(LocalDateTime.now());
        if (ticket.getCreatedAt() == null) {
            ticket.setCreatedAt(LocalDateTime.now());
        }
        return ticketRepository.save(ticket);
    }

    @Transactional
    public TicketModel updateTicket(TicketModel ticket) {
        return ticketRepository.save(ticket);
    }
}