package com.faculdade.customer_service_back.controller.technical_controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.faculdade.customer_service_back.model.technical_model.Technical;
import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.service.technical_service.TechnicalService;

@RestController
@RequestMapping("/api/technical")
public class TechnicalController {

    private final TechnicalService technicalService;

    //@Autowired
    public TechnicalController(TechnicalService technicalService) {
        this.technicalService = technicalService;
    }

    @GetMapping
    public ResponseEntity<List<Technical>> getAllTechnicals() {
        List<Technical> technicians = technicalService.findAll();
        return technicians.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(technicians);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTechnicalById(@PathVariable Long id) {
        Optional<Technical> technicalOpt = Optional.ofNullable(technicalService.getTechnicalById(id));
        if (technicalOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Technical technical = technicalOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("id", technical.getId());
        response.put("name", technical.getName());
        response.put("email", technical.getEmail());
        response.put("phone", technical.getPhone());

        List<Long> ticketIds = (technical.getTicketQueue() != null)
                ? technical.getTicketQueue().stream().map(TicketModel::getId).collect(Collectors.toList())
                : List.of();

        response.put("ticketIds", ticketIds);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Technical> createTechnical(@RequestBody Technical technical) {
        Technical savedTechnical = technicalService.saveTechnical(technical);
        return ResponseEntity.status(201).body(savedTechnical);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTechnical(@PathVariable Long id) {
        technicalService.deleteTechnical(id);
        return ResponseEntity.noContent().build();
    }
}