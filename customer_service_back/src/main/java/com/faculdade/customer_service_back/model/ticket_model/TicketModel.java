package com.faculdade.customer_service_back.model.ticket_model;

import com.faculdade.customer_service_back.model.client_model.ClientePf; // Importar ClientePf
import com.faculdade.customer_service_back.model.client_model.ClientePJ; // Importar ClientePJ
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import com.faculdade.customer_service_back.model.technical_model.Technical;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
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

    // --- NOVOS RELACIONAMENTOS ADICIONADOS ---
    // Um chamado pode pertencer a um Cliente PF.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_pf_id", nullable = true) // A coluna será nullable porque um ticket pode ser de um PJ em vez de PF
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Evita problemas de serialização com proxy LAZY
    private ClientePf clientePf;

    // Ou um chamado pode pertencer a um Cliente PJ.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_pj_id", nullable = true) // A coluna também será nullable
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Evita problemas de serialização com proxy LAZY
    private ClientePJ clientePj;
    // --- FIM DOS NOVOS RELACIONAMENTOS ---


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
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime resolvedAt; // Data de fechamento do chamado

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        status = TicketStatus.OPEN;
    }
}
