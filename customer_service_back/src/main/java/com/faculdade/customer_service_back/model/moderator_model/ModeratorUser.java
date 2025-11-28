package com.faculdade.customer_service_back.model.moderator_model;

import com.faculdade.customer_service_back.model.user_model.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "moderator_users")
@Data
public class ModeratorUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    @JsonIgnoreProperties({"password", "roles"})
    private User user;

    @Column(name = "department")
    private String department; // Departamento do moderador

    @Column(name = "access_level")
    private Integer accessLevel; // Nível de acesso (1-5, sendo 5 o mais alto)

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @PrePersist
    protected void onCreate() {
        if (hireDate == null) {
            hireDate = LocalDate.now();
        }
        if (active == null) {
            active = true;
        }
        if (accessLevel == null) {
            accessLevel = 5;
        }
    }

    public ModeratorUser() {}

    public ModeratorUser(User user, String department) {
        this.user = user;
        this.department = department;
    }
}
