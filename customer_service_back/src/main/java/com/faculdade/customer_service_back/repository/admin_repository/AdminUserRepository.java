package com.faculdade.customer_service_back.repository.admin_repository;

import com.faculdade.customer_service_back.model.admin_model.AdminUser;
import com.faculdade.customer_service_back.model.user_model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

    Optional<AdminUser> findByUser(User user);

    Optional<AdminUser> findByUserId(Long userId);

    List<AdminUser> findByActive(Boolean active);

    List<AdminUser> findBySpecialization(String specialization);

    List<AdminUser> findBySpecializationAndActive(String specialization, Boolean active);

    @Query("SELECT au FROM AdminUser au JOIN FETCH au.assignedTickets WHERE au.id = :id")
    AdminUser findByIdWithTickets(@Param("id") Long id);

    @Query("SELECT au FROM AdminUser au WHERE au.active = true ORDER BY SIZE(au.assignedTickets) ASC")
    List<AdminUser> findActiveTechniciansOrderedByWorkload();

    Boolean existsByUserId(Long userId);
}
