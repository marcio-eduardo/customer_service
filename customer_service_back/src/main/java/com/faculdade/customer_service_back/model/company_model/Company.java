package com.faculdade.customer_service_back.model.company_model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "companies")
@Data
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String cnpj;

    private String address;

    private String phone;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private Integer slaHours = 24; // Default value

    public Company() {
    }

    public Company(String name, String cnpj, String address, String phone, String email) {
        this.name = name;
        this.cnpj = cnpj;
        this.address = address;
        this.phone = phone;
        this.email = email;
    }
}
