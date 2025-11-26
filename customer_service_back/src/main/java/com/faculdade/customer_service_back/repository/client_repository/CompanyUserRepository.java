package com.faculdade.customer_service_back.repository.client_repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.faculdade.customer_service_back.model.client_model.CompanyUser;

@Repository
public interface CompanyUserRepository extends JpaRepository<CompanyUser, Long> {

    CompanyUser findByCpf(String cpf);

    List<CompanyUser> findByNameContainingIgnoreCase(String name);

}
