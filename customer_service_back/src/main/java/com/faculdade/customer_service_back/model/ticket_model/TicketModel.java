package com.faculdade.customer_service_back.model.ticket_model;

import com.faculdade.customer_service_back.model.admin_model.AdminUser;
import com.faculdade.customer_service_back.model.client_model.Company;
import com.faculdade.customer_service_back.model.client_model.CompanyUser;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tickets")
public class TicketModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    @Enumerated(EnumType.STRING)
    private TicketPriority priority;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "user", "company"})
    private CompanyUser createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "users"})
    private Company company;

    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    @JsonIgnoreProperties({"user", "assignedTickets"})
    private AdminUser assignedTo;

    @ManyToOne
    @JoinColumn(name = "closed_by_id", nullable = true)
    @JsonIgnoreProperties({"user", "assignedTickets"})
    private AdminUser closedBy;

    @Column(nullable = true, length = 500)
    private String resolutionNotes;

    @Column
    private LocalDateTime openDate;

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime resolvedAt; // Data de fechamento do chamado

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        openDate = LocalDateTime.now(); // Set openDate on creation
        status = TicketStatus.OPEN;
    }
}
