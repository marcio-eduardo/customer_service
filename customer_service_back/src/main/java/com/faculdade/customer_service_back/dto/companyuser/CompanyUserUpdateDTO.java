package com.faculdade.customer_service_back.dto.companyuser;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CompanyUserUpdateDTO {

    @NotNull(message = "Company ID is required")
    private Long companyId;
}
