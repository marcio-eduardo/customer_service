package com.faculdade.customer_service_back.dto.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponseDTO {
    
    private Long id;
    private String tradingName;
    private String taxId;
    private String legalName;
    private String address;
    private String phone;
    private String email;
    private LocalDate registrationDate;
    private Long responsibleId;
    private String responsibleName;
}
