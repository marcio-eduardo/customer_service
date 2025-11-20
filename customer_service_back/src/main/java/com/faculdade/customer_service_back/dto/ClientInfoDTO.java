package com.faculdade.customer_service_back.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClientInfoDTO {

    private Long clientePfId;
    private Long clientePjId;

    public ClientInfoDTO(Long clientePfId, Long clientePjId) {
        this.clientePfId = clientePfId;
        this.clientePjId = clientePjId;
    }

    // Getters and Setters
    public Long getClientePfId() {
        return clientePfId;
    }

    public void setClientePfId(Long clientePfId) {
        this.clientePfId = clientePfId;
    }

    public Long getClientePjId() {
        return clientePjId;
    }

    public void setClientePjId(Long clientePjId) {
        this.clientePjId = clientePjId;
    }
}
