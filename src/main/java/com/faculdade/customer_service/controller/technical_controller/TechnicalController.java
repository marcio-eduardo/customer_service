package com.faculdade.customer_service.controller.technical_controller;

import com.faculdade.customer_service.model.technical_model.Technical;
import com.faculdade.customer_service.service.technical_service.TechnicalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/technical")
public class TechnicalController {

    @Autowired
    private TechnicalService technicalService;

    @GetMapping
    public ResponseEntity<List<Technical>> getAllTechnicals() {
        List<Technical> technicians = technicalService.findAll();
        return ResponseEntity.ok(technicians);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Technical> getTechnicalById(@PathVariable Long id) {
        Optional<Technical> technical = technicalService.findById(id);
        return technical.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Technical> createTechnical(@RequestBody Technical technical) {
        Technical savedTechnical = technicalService.saveTechnical(technical);
        return ResponseEntity.ok(savedTechnical);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTechnical(@PathVariable Long id) {
        technicalService.deleteTechnical(id);
        return ResponseEntity.noContent().build();
    }
}