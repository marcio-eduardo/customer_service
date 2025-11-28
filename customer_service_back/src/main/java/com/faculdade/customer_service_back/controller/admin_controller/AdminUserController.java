package com.faculdade.customer_service_back.controller.admin_controller;

import com.faculdade.customer_service_back.dto.adminuser.AdminUserCreateDTO;
import com.faculdade.customer_service_back.dto.adminuser.AdminUserUpdateDTO;
import com.faculdade.customer_service_back.model.admin_model.AdminUser;
import com.faculdade.customer_service_back.model.user_model.User;
import com.faculdade.customer_service_back.repository.user_repository.UserRepository;
import com.faculdade.customer_service_back.service.admin_service.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin-users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminUserController {

    @Autowired
    private AdminUserService adminUserService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<List<AdminUser>> getAllAdminUsers() {
        return ResponseEntity.ok(adminUserService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<AdminUser> getAdminUserById(@PathVariable Long id) {
        return adminUserService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<AdminUser> getAdminUserByUserId(@PathVariable Long userId) {
        return adminUserService.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<AdminUser>> getActiveAdminUsers() {
        return ResponseEntity.ok(adminUserService.findByActive(true));
    }

    @GetMapping("/workload")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<AdminUser>> getAdminUsersByWorkload() {
        return ResponseEntity.ok(adminUserService.findActiveTechniciansOrderedByWorkload());
    }

    @PostMapping
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> createAdminUser(@Valid @RequestBody AdminUserCreateDTO dto) {
        try {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserId()));

            if (adminUserService.existsByUserId(dto.getUserId())) {
                return ResponseEntity.badRequest().body("User already has an AdminUser profile");
            }

            AdminUser adminUser = new AdminUser();
            adminUser.setUser(user);
            adminUser.setSpecialization(dto.getSpecialization());
            adminUser.setActive(dto.getActive() != null ? dto.getActive() : true);

            AdminUser saved = adminUserService.save(adminUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating AdminUser: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> updateAdminUser(@PathVariable Long id, @Valid @RequestBody AdminUserUpdateDTO dto) {
        try {
            AdminUser adminUser = adminUserService.findById(id)
                    .orElseThrow(() -> new RuntimeException("AdminUser not found with ID: " + id));

            if (dto.getSpecialization() != null) {
                adminUser.setSpecialization(dto.getSpecialization());
            }
            if (dto.getActive() != null) {
                adminUser.setActive(dto.getActive());
            }

            AdminUser updated = adminUserService.save(adminUser);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating AdminUser: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> deleteAdminUser(@PathVariable Long id) {
        try {
            adminUserService.deleteById(id);
            return ResponseEntity.ok("AdminUser deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting AdminUser: " + e.getMessage());
        }
    }
}
