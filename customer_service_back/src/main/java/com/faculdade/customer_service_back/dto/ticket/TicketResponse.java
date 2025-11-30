package com.faculdade.customer_service_back.dto.ticket;

import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.model.ticket_model.TicketPriority;
import com.faculdade.customer_service_back.model.ticket_model.TicketStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TicketResponse {

    private Long id;
    private String title;
    private String description;
    private TicketStatus status;
    private TicketPriority priority;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private String resolutionNotes;
    private Integer rating;
    private LocalDateTime slaDueDate;

    // Company info
    private CompanyInfo company;

    // User info
    private UserInfo openedBy;
    private UserInfo assignedTo;

    @Data
    public static class CompanyInfo {
        private Long id;
        private String name;
        private String cnpj;

        public CompanyInfo(Long id, String name, String cnpj) {
            this.id = id;
            this.name = name;
            this.cnpj = cnpj;
        }
    }

    @Data
    public static class UserInfo {
        private Long id;
        private String username;
        private String email;

        public UserInfo(Long id, String username, String email) {
            this.id = id;
            this.username = username;
            this.email = email;
        }
    }

    public TicketResponse(TicketModel ticket) {
        this.id = ticket.getId();
        this.title = ticket.getTitle();
        this.description = ticket.getDescription();
        this.status = ticket.getStatus();
        this.priority = ticket.getPriority();
        this.createdAt = ticket.getCreatedAt();
        this.resolvedAt = ticket.getResolvedAt();
        this.resolutionNotes = ticket.getResolutionNotes();
        this.rating = ticket.getRating();
        this.slaDueDate = ticket.getSlaDueDate();

        if (ticket.getCompany() != null) {
            this.company = new CompanyInfo(
                    ticket.getCompany().getId(),
                    ticket.getCompany().getName(),
                    ticket.getCompany().getCnpj());
        }

        if (ticket.getOpenedBy() != null) {
            this.openedBy = new UserInfo(
                    ticket.getOpenedBy().getId(),
                    ticket.getOpenedBy().getUsername(),
                    ticket.getOpenedBy().getEmail());
        }

        if (ticket.getAssignedTo() != null) {
            this.assignedTo = new UserInfo(
                    ticket.getAssignedTo().getId(),
                    ticket.getAssignedTo().getUsername(),
                    ticket.getAssignedTo().getEmail());
        }
    }
}
