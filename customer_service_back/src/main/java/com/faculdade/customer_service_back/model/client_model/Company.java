package com.faculdade.customer_service_back.model.client_model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "companies")
@Data
@EqualsAndHashCode(exclude = {"responsible", "users"})
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tradingName;

    @Column(unique = true, nullable = false, length = 20)
    private String taxId;

    @Column(nullable = false)
    private String legalName;

    private String address;

    private String phone;

    private String email;

    @Column(name = "registration_date", nullable = false, updatable = false)
    private LocalDate registrationDate;

    @ManyToOne
    @JoinColumn(name = "responsible_id", nullable = false)
    @JsonIgnore
    private CompanyUser responsible;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private Set<CompanyUser> users = new HashSet<>();

    public Company() {}

    public Company(String tradingName, String taxId, String legalName, String address, String phone, String email, CompanyUser responsible) {
        this.tradingName = tradingName;
        this.taxId = taxId;
        this.legalName = legalName;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.responsible = responsible;
    }

    @PrePersist
    protected void onCreate() {
        this.registrationDate = LocalDate.now();
    }
}
