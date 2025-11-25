package com.faculdade.customer_service_back.model.ticket_model;

import lombok.Data;

@Data
public class TicketOpenRequest {

    private String title;
    private String description;
    private TicketPriority priority; // Adicionando o campo de prioridade

    // IDs para identificar o cliente que está a abrir o chamado.
    // A lógica de negócio espera que apenas um deles seja preenchido.
    private Long clientePfId;
    private Long clientePjId;

    // O technicalId foi removido, pois a atribuição a um técnico é um passo posterior,
    // não algo definido no momento da criação pelo cliente.
    // private Long technicalId;

}
