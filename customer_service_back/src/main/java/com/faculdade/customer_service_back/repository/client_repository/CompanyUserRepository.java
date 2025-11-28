package com.faculdade.customer_service_back.repository.client_repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.faculdade.customer_service_back.model.client_model.CompanyUser;
import com.faculdade.customer_service_back.model.user_model.User;

@Repository
public interface CompanyUserRepository extends JpaRepository<CompanyUser, Long> {

    Optional<CompanyUser> findByUser(User user);

    Optional<CompanyUser> findByUserId(Long userId);

    List<CompanyUser> findByCompanyId(Long companyId);

    @Query("SELECT cu FROM CompanyUser cu WHERE cu.user.name LIKE %:name%")
    List<CompanyUser> findByNameContainingIgnoreCase(@Param("name") String name);

    List<CompanyUser> findByCompanyIsNull();

    Boolean existsByUserId(Long userId);
}
