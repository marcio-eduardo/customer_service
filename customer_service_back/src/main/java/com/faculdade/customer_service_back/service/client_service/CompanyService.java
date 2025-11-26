package com.faculdade.customer_service_back.service.client_service;

import com.faculdade.customer_service_back.model.client_model.Company;
import com.faculdade.customer_service_back.repository.client_repository.CompanyRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    @Autowired
    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public Page<Company> findAll(Pageable pageable) {
        return companyRepository.findAll(pageable);
    }

    public List<Company> findAllWithoutPagination() {
        return companyRepository.findAll();
    }

    public Company findById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Company not found with ID: " + id));
    }

    public Company findByTaxId(String taxId) {
        return companyRepository.findByTaxId(taxId);
    }

    public Company save(Company company) {
        if (companyRepository.findByTaxId(company.getTaxId()) != null) {
            throw new EntityExistsException("Tax ID already registered: " + company.getTaxId());
        }
        return companyRepository.save(company);
    }

    public Company update(Long id, Company companyToUpdate) {
        Company existingCompany = findById(id);
        existingCompany.setTradingName(companyToUpdate.getTradingName());
        existingCompany.setLegalName(companyToUpdate.getLegalName());
        existingCompany.setAddress(companyToUpdate.getAddress());
        existingCompany.setPhone(companyToUpdate.getPhone());
        existingCompany.setEmail(companyToUpdate.getEmail());
        existingCompany.setResponsible(companyToUpdate.getResponsible());
        return companyRepository.save(existingCompany);
    }

    public void delete(Long id) {
        Company company = findById(id);
        companyRepository.delete(company);
    }
}