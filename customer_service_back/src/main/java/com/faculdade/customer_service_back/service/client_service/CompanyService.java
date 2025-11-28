package com.faculdade.customer_service_back.service.client_service;

import com.faculdade.customer_service_back.dto.client.CompanyRequestDTO;
import com.faculdade.customer_service_back.dto.client.CompanyResponseDTO;
import com.faculdade.customer_service_back.model.client_model.Company;
import com.faculdade.customer_service_back.model.client_model.CompanyUser;
import com.faculdade.customer_service_back.repository.client_repository.CompanyRepository;
import com.faculdade.customer_service_back.repository.client_repository.CompanyUserRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyUserRepository companyUserRepository;
    private final CompanyUserService companyUserService;

    @Autowired
    public CompanyService(CompanyRepository companyRepository, CompanyUserRepository companyUserRepository, CompanyUserService companyUserService) {
        this.companyRepository = companyRepository;
        this.companyUserRepository = companyUserRepository;
        this.companyUserService = companyUserService;
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

    @Transactional
    public CompanyResponseDTO saveFromDTO(CompanyRequestDTO dto) {
        if (companyRepository.findByTaxId(dto.getTaxId()) != null) {
            throw new EntityExistsException("Tax ID already registered: " + dto.getTaxId());
        }

        CompanyUser responsible = companyUserService.findById(dto.getResponsibleId());
        String responsibleName = responsible.getUser() != null ? responsible.getUser().getName() : null;

        Company company = new Company();
        company.setTradingName(dto.getTradingName());
        company.setTaxId(dto.getTaxId());
        company.setLegalName(dto.getLegalName());
        company.setAddress(dto.getAddress());
        company.setPhone(dto.getPhone());
        company.setEmail(dto.getEmail());
        company.setResponsible(responsible);

        Company savedCompany = companyRepository.save(company);

        if (dto.getUserIds() != null && !dto.getUserIds().isEmpty()) {
            List<CompanyUser> usersToAssociate = companyUserRepository.findAllById(dto.getUserIds());
            for (CompanyUser user : usersToAssociate) {
                user.setCompany(savedCompany);
                companyUserRepository.save(user);
            }
        }

        return CompanyResponseDTO.builder()
                .id(savedCompany.getId())
                .tradingName(dto.getTradingName())
                .taxId(dto.getTaxId())
                .legalName(dto.getLegalName())
                .address(dto.getAddress())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .registrationDate(savedCompany.getRegistrationDate())
                .responsibleId(dto.getResponsibleId())
                .responsibleName(responsibleName)
                .build();
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