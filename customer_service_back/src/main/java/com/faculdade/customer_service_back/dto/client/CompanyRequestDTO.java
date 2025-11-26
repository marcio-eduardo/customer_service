package com.faculdade.customer_service_back.dto.client;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class CompanyRequestDTO {

    @NotBlank(message = "Trading name is mandatory")
    private String tradingName;

    @NotBlank(message = "Tax ID is mandatory")
    @Size(max = 20, message = "Tax ID must be up to 20 characters")
    private String taxId;

    @NotBlank(message = "Legal name is mandatory")
    private String legalName;

    private String address;

    private String phone;

    private String email;

    @NotNull(message = "Responsible ID is mandatory")
    private Long responsibleId;

    private List<Long> userIds;
}
