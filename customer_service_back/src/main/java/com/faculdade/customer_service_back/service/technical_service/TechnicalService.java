package com.faculdade.customer_service_back.service.technical_service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.faculdade.customer_service_back.model.technical_model.Technical;
import com.faculdade.customer_service_back.repository.technical_repository.TechnicalRepository;

@Service
public class TechnicalService {

    private final TechnicalRepository technicalRepository;

    //@Autowired
    public TechnicalService(TechnicalRepository technicalRepository) {
        this.technicalRepository = technicalRepository;
    }

    public List<Technical> findAll() {
        return technicalRepository.findAll();
    }

    public Optional<Technical> findById(Long id) {
        return technicalRepository.findById(id);
    }

    public Technical findByIdWithTickets(Long id) {
        return technicalRepository.findByIdWithTickets(id);
    }

    public Technical saveTechnical(Technical technical) {
        return technicalRepository.save(technical);
    }

    public void deleteTechnical(Long id) {
        technicalRepository.deleteById(id);
    }

    // Método corrigido para obter um técnico por ID com seus chamados
    public Technical getTechnicalById(Long id) {
        Technical technical = technicalRepository.findByIdWithTickets(id);
        return (technical != null && technical.getTicketQueue() != null) ? technical : null;
    }

    // Método para retornar os IDs dos chamados atribuídos ao técnico
    public List<Long> getAssignedTicketIds(Long technicalId) {
        Technical technical = technicalRepository.findByIdWithTickets(technicalId);
        return (technical != null && technical.getTicketQueue() != null)
                ? technical.getTicketQueue().stream()
                .map(ticket -> ticket.getId())
                .collect(Collectors.toList())
                : List.of();
    }
}