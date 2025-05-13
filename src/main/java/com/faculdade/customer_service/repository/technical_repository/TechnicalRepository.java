package com.faculdade.customer_service.repository.technical_repository;

import com.faculdade.customer_service.model.technical_model.Technical;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TechnicalRepository extends JpaRepository<Technical, Long> {
    Technical findByEmail(String email);
}