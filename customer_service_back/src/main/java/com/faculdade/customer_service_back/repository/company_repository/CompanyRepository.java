package com.faculdade.customer_service_back.repository.company_repository;

import com.faculdade.customer_service_back.model.company_model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByCnpj(String cnpj);
    Optional<Company> findByEmail(String email);
}
