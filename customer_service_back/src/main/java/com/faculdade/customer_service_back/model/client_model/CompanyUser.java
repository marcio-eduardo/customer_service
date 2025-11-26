package com.faculdade.customer_service_back.model.client_model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Table(name = "company_users")
@Data
public class CompanyUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false, length = 14)
    private String cpf;

    private String address;

    private String phone;

    private String email;

    @Column(name = "registration_date", nullable = false, updatable = false)
    private LocalDate registrationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = true)
    @JsonBackReference
    @ToString.Exclude
    private Company company;

    public CompanyUser() {}

    public CompanyUser(String name, String cpf, String address, String phone, String email) {
        this.name = name;
        this.cpf = cpf;
        this.address = address;
        this.phone = phone;
        this.email = email;
    }

    @PrePersist
    protected void onCreate() {
        this.registrationDate = LocalDate.now();
    }
}
