package com.faculdade.customer_service.service.technical_service;

import com.faculdade.customer_service.model.technical_model.Technical;
import com.faculdade.customer_service.repository.technical_repository.TechnicalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TechnicalService {

    @Autowired
    private TechnicalRepository technicalRepository;

    public List<Technical> findAll() {
        return technicalRepository.findAll();
    }

    public Optional<Technical> findById(Long id) {
        return technicalRepository.findById(id);
    }

    public Technical saveTechnical(Technical technical) {
        return technicalRepository.save(technical);
    }

    public void deleteTechnical(Long id) {
        technicalRepository.deleteById(id);
    }
}