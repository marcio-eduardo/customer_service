package com.faculdade.customer_service_back.model.admin_model;

import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.model.user_model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "admin_users")
@Data
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    @JsonIgnoreProperties({"password", "roles"})
    private User user;

    @Column(name = "specialization")
    private String specialization; // Especialização do técnico (ex: "Hardware", "Software", "Rede")

    @Column(name = "active", nullable = false)
    private Boolean active = true; // Se o técnico está ativo para receber chamados

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @OneToMany(mappedBy = "assignedTo", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<TicketModel> assignedTickets;

    @PrePersist
    protected void onCreate() {
        if (hireDate == null) {
            hireDate = LocalDate.now();
        }
        if (active == null) {
            active = true;
        }
    }

    public AdminUser() {}

    public AdminUser(User user, String specialization) {
        this.user = user;
        this.specialization = specialization;
    }
}
