package com.faculdade.customer_service_back.model.ticket_model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TicketOpenRequest {
    // Getters e Setters
    private String title;
    private String description;
    private Long technicalId; // Técnico responsável pelo chamado

}