package com.faculdade.customer_service_back.dto.companyuser;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CompanyUserCreateDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

    private Long companyId; // Opcional - pode ser atribuído depois
}
