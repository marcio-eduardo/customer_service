package com.faculdade.customer_service_back.dto.company;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateCompanyRequest {

    private String name;
    private String cnpj;
    private String address;
    private String phone;

    @Email(message = "Email inválido")
    private String email;

    private Integer slaHours;
}
