package com.faculdade.customer_service_back.controller.client_controller;

import com.faculdade.customer_service_back.model.client_model.CompanyUser;
import com.faculdade.customer_service_back.service.client_service.CompanyUserService;
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
@RequestMapping("/api/company-users")
public class CompanyUserController {

    private final CompanyUserService companyUserService;

    public CompanyUserController(CompanyUserService companyUserService) {
        this.companyUserService = companyUserService;
    }

    @GetMapping
    public ResponseEntity<Page<CompanyUser>> findAll(Pageable pageable) {
        Page<CompanyUser> users = companyUserService.findAll(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/all")
    public ResponseEntity<List<CompanyUser>> findAllWithoutPagination() {
        List<CompanyUser> users = companyUserService.findAllWithoutPagination();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/unassigned")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<CompanyUser>> findUnassignedUsers() {
        List<CompanyUser> users = companyUserService.findUnassignedUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyUser> findById(@PathVariable Long id) {
        try {
            CompanyUser user = companyUserService.findById(id);
            return ResponseEntity.ok(user);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<CompanyUser> findByCpf(@PathVariable String cpf) {
        CompanyUser user = companyUserService.findByCpf(cpf);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<CompanyUser> save(@Valid @RequestBody CompanyUser companyUser) {
        CompanyUser savedUser = companyUserService.save(companyUser);
        return ResponseEntity.created(URI.create("/api/company-users/" + savedUser.getId())).body(savedUser);
    }

    @PostMapping("/batch")
    public ResponseEntity<Void> saveBatch(@Valid @RequestBody List<CompanyUser> users) {
        users.forEach(companyUserService::save);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyUser> update(@PathVariable Long id, @RequestBody CompanyUser companyUser) {
        try {
            CompanyUser updatedUser = companyUserService.update(id, companyUser);
            return ResponseEntity.ok(updatedUser);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        companyUserService.delete(id);
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