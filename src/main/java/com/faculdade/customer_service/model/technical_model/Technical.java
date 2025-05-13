package com.faculdade.customer_service.model.technical_model;

import com.faculdade.customer_service.model.ticket_model.Ticket;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "technicians")
public class Technical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @OneToMany(mappedBy = "technical", cascade = CascadeType.ALL)
    private List<Ticket> ticketQueue;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public List<Ticket> getTicketQueue() { return ticketQueue; }
    public void setTicketQueue(List<Ticket> ticketQueue) { this.ticketQueue = ticketQueue; }
}