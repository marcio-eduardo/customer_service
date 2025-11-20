package com.faculdade.customer_service_back.controller.me_controller;

import com.faculdade.customer_service_back.dto.ClientInfoDTO;
import com.faculdade.customer_service_back.security.services.UserDetailsImpl;
import com.faculdade.customer_service_back.service.MeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/me")
public class MeController {

    private final MeService meService;

    public MeController(MeService meService) {
        this.meService = meService;
    }

    @GetMapping("/client-info")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ClientInfoDTO> getClientInfo(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        ClientInfoDTO clientInfo = meService.getClientInfo(userDetails);
        if (clientInfo.getClientePfId() == null && clientInfo.getClientePjId() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(clientInfo);
    }
}
