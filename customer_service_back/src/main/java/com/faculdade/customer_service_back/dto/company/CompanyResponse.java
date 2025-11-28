package com.faculdade.customer_service_back.dto.company;

import com.faculdade.customer_service_back.model.company_model.Company;
import lombok.Data;

@Data
public class CompanyResponse {
    
    private Long id;
    private String name;
    private String cnpj;
    private String address;
    private String phone;
    private String email;
    
    public CompanyResponse(Company company) {
        this.id = company.getId();
        this.name = company.getName();
        this.cnpj = company.getCnpj();
        this.address = company.getAddress();
        this.phone = company.getPhone();
        this.email = company.getEmail();
    }
}
