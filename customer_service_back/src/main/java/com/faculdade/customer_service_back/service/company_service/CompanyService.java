package com.faculdade.customer_service_back.service.company_service;

import com.faculdade.customer_service_back.dto.company.CompanyRequest;
import com.faculdade.customer_service_back.dto.company.CompanyResponse;
import com.faculdade.customer_service_back.dto.company.UpdateCompanyRequest;
import com.faculdade.customer_service_back.model.company_model.Company;
import com.faculdade.customer_service_back.repository.company_repository.CompanyRepository;
import com.faculdade.customer_service_back.repository.user_repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public CompanyService(CompanyRepository companyRepository, UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CompanyResponse createCompany(CompanyRequest request) {
        // Validar se já existe empresa com mesmo CNPJ
        if (companyRepository.findByCnpj(request.getCnpj()).isPresent()) {
            throw new RuntimeException("Já existe uma empresa cadastrada com este CNPJ");
        }

        // Validar se já existe empresa com mesmo email
        if (companyRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Já existe uma empresa cadastrada com este email");
        }

        Company company = new Company();
        company.setName(request.getName());
        company.setCnpj(request.getCnpj());
        company.setAddress(request.getAddress());
        company.setPhone(request.getPhone());
        company.setPhone(request.getPhone());
        company.setEmail(request.getEmail());
        if (request.getSlaHours() != null) {
            company.setSlaHours(request.getSlaHours());
        }

        Company savedCompany = companyRepository.save(company);
        return new CompanyResponse(savedCompany);
    }

    public List<CompanyResponse> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(CompanyResponse::new)
                .collect(Collectors.toList());
    }

    public CompanyResponse getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada com id: " + id));
        return new CompanyResponse(company);
    }

    @Transactional
    public CompanyResponse updateCompany(Long id, UpdateCompanyRequest request) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada com id: " + id));

        // Atualizar apenas campos não nulos
        if (request.getName() != null) {
            company.setName(request.getName());
        }

        if (request.getCnpj() != null) {
            // Validar se o novo CNPJ já existe em outra empresa
            companyRepository.findByCnpj(request.getCnpj()).ifPresent(existingCompany -> {
                if (!existingCompany.getId().equals(id)) {
                    throw new RuntimeException("Já existe outra empresa cadastrada com este CNPJ");
                }
            });
            company.setCnpj(request.getCnpj());
        }

        if (request.getAddress() != null) {
            company.setAddress(request.getAddress());
        }

        if (request.getPhone() != null) {
            company.setPhone(request.getPhone());
        }

        if (request.getEmail() != null) {
            // Validar se o novo email já existe em outra empresa
            companyRepository.findByEmail(request.getEmail()).ifPresent(existingCompany -> {
                if (!existingCompany.getId().equals(id)) {
                    throw new RuntimeException("Já existe outra empresa cadastrada com este email");
                }
            });
            company.setEmail(request.getEmail());
        }

        if (request.getSlaHours() != null) {
            company.setSlaHours(request.getSlaHours());
        }

        Company updatedCompany = companyRepository.save(company);
        return new CompanyResponse(updatedCompany);
    }

    @Transactional
    public void deleteCompany(Long id) {
        if (!companyRepository.existsById(id)) {
            throw new RuntimeException("Empresa não encontrada com id: " + id);
        }

        Long userCount = userRepository.countByCompanyId(id);
        if (userCount > 0) {
            throw new RuntimeException("Não é possível excluir esta empresa pois existem " + userCount
                    + " usuário(s) vinculado(s). Remova ou transfira os usuários antes de excluir a empresa.");
        }

        companyRepository.deleteById(id);
    }
}
