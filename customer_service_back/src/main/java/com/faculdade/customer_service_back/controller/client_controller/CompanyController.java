package com.faculdade.customer_service_back.controller.client_controller;

import com.faculdade.customer_service_back.dto.client.CompanyRequestDTO;
import com.faculdade.customer_service_back.dto.client.CompanyResponseDTO;
import com.faculdade.customer_service_back.model.client_model.Company;
import com.faculdade.customer_service_back.service.client_service.CompanyService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    public ResponseEntity<Page<Company>> findAll(Pageable pageable) {
        Page<Company> companies = companyService.findAll(pageable);
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Company>> findAllWithoutPagination() {
        List<Company> companies = companyService.findAllWithoutPagination();
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> findById(@PathVariable Long id) {
        try {
            Company company = companyService.findById(id);
            return ResponseEntity.ok(company);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/tax-id/{taxId}")
    public ResponseEntity<Company> findByTaxId(@PathVariable String taxId) {
        Company company = companyService.findByTaxId(taxId);
        return company != null ? ResponseEntity.ok(company) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<CompanyResponseDTO> save(@Valid @RequestBody CompanyRequestDTO companyRequestDTO) {
        CompanyResponseDTO savedCompany = companyService.saveFromDTO(companyRequestDTO);
        return ResponseEntity.created(URI.create("/api/companies/" + savedCompany.getId())).body(savedCompany);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Company> update(@PathVariable Long id, @RequestBody Company company) {
        try {
            Company updatedCompany = companyService.update(id, company);
            return ResponseEntity.ok(updatedCompany);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        companyService.delete(id);
    }

    @RestControllerAdvice
    public class GlobalExceptionHandler {

        @ExceptionHandler(EntityNotFoundException.class)
        public ResponseEntity<String> handleNotFoundException(EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        @ExceptionHandler(EntityExistsException.class)
        public ResponseEntity<String> handleConflictException(EntityExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}