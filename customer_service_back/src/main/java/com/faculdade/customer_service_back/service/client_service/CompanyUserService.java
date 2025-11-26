package com.faculdade.customer_service_back.service.client_service;

import com.faculdade.customer_service_back.model.client_model.CompanyUser;
import com.faculdade.customer_service_back.repository.client_repository.CompanyUserRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyUserService {

    private final CompanyUserRepository companyUserRepository;

    @Autowired
    public CompanyUserService(CompanyUserRepository companyUserRepository) {
        this.companyUserRepository = companyUserRepository;
    }

    public Page<CompanyUser> findAll(Pageable pageable) {
        return companyUserRepository.findAll(pageable);
    }

    public List<CompanyUser> findAllWithoutPagination() {
        return companyUserRepository.findAll();
    }

    public CompanyUser findById(Long id) {
        return companyUserRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Company user not found with ID: " + id));
    }

    public CompanyUser findByCpf(String cpf) {
        return companyUserRepository.findByCpf(cpf);
    }

    public CompanyUser save(CompanyUser companyUser) {
        if (companyUserRepository.findByCpf(companyUser.getCpf()) != null) {
            throw new EntityExistsException("CPF already registered: " + companyUser.getCpf());
        }
        return companyUserRepository.save(companyUser);
    }

    public CompanyUser update(Long id, CompanyUser companyUserToUpdate) {
        CompanyUser existingUser = findById(id);
        existingUser.setName(companyUserToUpdate.getName());
        existingUser.setAddress(companyUserToUpdate.getAddress());
        existingUser.setPhone(companyUserToUpdate.getPhone());
        existingUser.setEmail(companyUserToUpdate.getEmail());
        return companyUserRepository.save(existingUser);
    }

    public void delete(Long id) {
        CompanyUser companyUser = findById(id);
        companyUserRepository.delete(companyUser);
    }
}