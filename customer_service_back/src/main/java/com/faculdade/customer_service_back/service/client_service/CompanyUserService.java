package com.faculdade.customer_service_back.service.client_service;

import com.faculdade.customer_service_back.model.client_model.CompanyUser;
import com.faculdade.customer_service_back.model.user_model.User;
import com.faculdade.customer_service_back.repository.client_repository.CompanyUserRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyUserService {

    private final CompanyUserRepository companyUserRepository;

    @Autowired
    public CompanyUserService(CompanyUserRepository companyUserRepository) {
        this.companyUserRepository = companyUserRepository;
    }

    @Transactional(readOnly = true)
    public Page<CompanyUser> findAll(Pageable pageable) {
        return companyUserRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public List<CompanyUser> findAllWithoutPagination() {
        return companyUserRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<CompanyUser> findUnassignedUsers() {
        return companyUserRepository.findByCompanyIsNull();
    }

    @Transactional(readOnly = true)
    public CompanyUser findById(Long id) {
        return companyUserRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Company user not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public Optional<CompanyUser> findByUserId(Long userId) {
        return companyUserRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Optional<CompanyUser> findByUser(User user) {
        return companyUserRepository.findByUser(user);
    }

    @Transactional(readOnly = true)
    public List<CompanyUser> findByCompanyId(Long companyId) {
        return companyUserRepository.findByCompanyId(companyId);
    }

    @Transactional
    public CompanyUser save(CompanyUser companyUser) {
        if (companyUser.getUser() != null && companyUserRepository.existsByUserId(companyUser.getUser().getId())) {
            throw new EntityExistsException("User already registered: " + companyUser.getUser().getId());
        }
        return companyUserRepository.save(companyUser);
    }

    @Transactional
    public CompanyUser update(Long id, CompanyUser companyUserToUpdate) {
        CompanyUser existingUser = findById(id);
        existingUser.setCompany(companyUserToUpdate.getCompany());
        return companyUserRepository.save(existingUser);
    }

    @Transactional
    public void delete(Long id) {
        CompanyUser companyUser = findById(id);
        companyUserRepository.delete(companyUser);
    }

    @Transactional(readOnly = true)
    public boolean existsByUserId(Long userId) {
        return companyUserRepository.existsByUserId(userId);
    }
}