package com.faculdade.customer_service_back.model.ticket_model;

import com.faculdade.customer_service_back.model.client_model.Company;
import com.faculdade.customer_service_back.model.client_model.CompanyUser;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import com.faculdade.customer_service_back.model.technical_model.Technical;
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
    @JoinColumn(name = "company_user_id", nullable = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private CompanyUser companyUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Company company;

    @ManyToOne
    @JoinColumn(name = "technical_id")
    @JsonIgnoreProperties({"ticketQueue"})
    private Technical technical;

    @ManyToOne
    @JoinColumn(name = "closed_by_technical_id", nullable = true)
    @JsonIgnoreProperties({"ticketQueue"})
    private Technical closedByTechnical; // Técnico que fechou o chamado

    @Column(nullable = true, length = 500)
    private String resolutionNotes; // Texto da resolução

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
