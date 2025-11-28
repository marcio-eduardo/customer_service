package com.faculdade.customer_service_back.controller.dashboard_controller;

import com.faculdade.customer_service_back.dto.dashboard.DashboardStatsDTO;
import com.faculdade.customer_service_back.service.ticket_service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final TicketService ticketService;

    @Autowired
    public DashboardController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ROLE_TECH_USER', 'ROLE_MODERATOR')")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        DashboardStatsDTO stats = ticketService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
