package com.faculdade.customer_service_back.service.admin_service;

import com.faculdade.customer_service_back.model.admin_model.AdminUser;
import com.faculdade.customer_service_back.model.user_model.User;
import com.faculdade.customer_service_back.repository.admin_repository.AdminUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AdminUserService {

    private final AdminUserRepository adminUserRepository;

    public AdminUserService(AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminUser> findAll() {
        return adminUserRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<AdminUser> findById(Long id) {
        return adminUserRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<AdminUser> findByUserId(Long userId) {
        return adminUserRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Optional<AdminUser> findByUser(User user) {
        return adminUserRepository.findByUser(user);
    }

    @Transactional(readOnly = true)
    public List<AdminUser> findByActive(Boolean active) {
        return adminUserRepository.findByActive(active);
    }

    @Transactional(readOnly = true)
    public List<AdminUser> findBySpecialization(String specialization) {
        return adminUserRepository.findBySpecialization(specialization);
    }

    @Transactional(readOnly = true)
    public AdminUser findByIdWithTickets(Long id) {
        return adminUserRepository.findByIdWithTickets(id);
    }

    @Transactional(readOnly = true)
    public List<AdminUser> findActiveTechniciansOrderedByWorkload() {
        return adminUserRepository.findActiveTechniciansOrderedByWorkload();
    }

    @Transactional
    public AdminUser save(AdminUser adminUser) {
        return adminUserRepository.save(adminUser);
    }

    @Transactional
    public void deleteById(Long id) {
        adminUserRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean existsByUserId(Long userId) {
        return adminUserRepository.existsByUserId(userId);
    }
}
