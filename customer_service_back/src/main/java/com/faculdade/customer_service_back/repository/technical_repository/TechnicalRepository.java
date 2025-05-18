package com.faculdade.customer_service_back.repository.technical_repository;

import com.faculdade.customer_service_back.model.technical_model.Technical;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TechnicalRepository extends JpaRepository<Technical, Long> {

    Technical findByEmail(String email);

    @Query(value = "SELECT t FROM Technical t LEFT JOIN FETCH t.ticketQueue WHERE t.id = :id")
    Technical findByIdWithTickets(@Param("id") Long id);
}