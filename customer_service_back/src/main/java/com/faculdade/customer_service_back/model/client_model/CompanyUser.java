package com.faculdade.customer_service_back.model.client_model;

import com.faculdade.customer_service_back.model.user_model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Table(name = "company_users")
@Data
@EqualsAndHashCode(exclude = {"company", "user"})
public class CompanyUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    @JsonIgnoreProperties({"password", "roles"})
    private User user;

    @Column(name = "registration_date", nullable = false, updatable = false)
    private LocalDate registrationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = true)
    @JsonIgnore
    @ToString.Exclude
    private Company company;

    public CompanyUser() {}

    public CompanyUser(User user, Company company) {
        this.user = user;
        this.company = company;
    }

    @PrePersist
    protected void onCreate() {
        this.registrationDate = LocalDate.now();
    }
}
