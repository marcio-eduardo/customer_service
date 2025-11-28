package com.faculdade.customer_service_back.controller.moderator_controller;

import com.faculdade.customer_service_back.dto.moderatoruser.ModeratorUserCreateDTO;
import com.faculdade.customer_service_back.dto.moderatoruser.ModeratorUserUpdateDTO;
import com.faculdade.customer_service_back.model.moderator_model.ModeratorUser;
import com.faculdade.customer_service_back.model.user_model.User;
import com.faculdade.customer_service_back.repository.user_repository.UserRepository;
import com.faculdade.customer_service_back.service.moderator_service.ModeratorUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moderator-users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ModeratorUserController {

    @Autowired
    private ModeratorUserService moderatorUserService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<List<ModeratorUser>> getAllModeratorUsers() {
        return ResponseEntity.ok(moderatorUserService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<ModeratorUser> getModeratorUserById(@PathVariable Long id) {
        return moderatorUserService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<ModeratorUser> getModeratorUserByUserId(@PathVariable Long userId) {
        return moderatorUserService.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/department/{department}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<List<ModeratorUser>> getModeratorUsersByDepartment(@PathVariable String department) {
        return ResponseEntity.ok(moderatorUserService.findByDepartment(department));
    }

    @PostMapping
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> createModeratorUser(@Valid @RequestBody ModeratorUserCreateDTO dto) {
        try {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserId()));

            if (moderatorUserService.existsByUserId(dto.getUserId())) {
                return ResponseEntity.badRequest().body("User already has a ModeratorUser profile");
            }

            ModeratorUser moderatorUser = new ModeratorUser();
            moderatorUser.setUser(user);
            moderatorUser.setDepartment(dto.getDepartment());
            moderatorUser.setAccessLevel(dto.getAccessLevel() != null ? dto.getAccessLevel() : 5);
            moderatorUser.setActive(dto.getActive() != null ? dto.getActive() : true);

            ModeratorUser saved = moderatorUserService.save(moderatorUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating ModeratorUser: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> updateModeratorUser(@PathVariable Long id, @Valid @RequestBody ModeratorUserUpdateDTO dto) {
        try {
            ModeratorUser moderatorUser = moderatorUserService.findById(id)
                    .orElseThrow(() -> new RuntimeException("ModeratorUser not found with ID: " + id));

            if (dto.getDepartment() != null) {
                moderatorUser.setDepartment(dto.getDepartment());
            }
            if (dto.getAccessLevel() != null) {
                moderatorUser.setAccessLevel(dto.getAccessLevel());
            }
            if (dto.getActive() != null) {
                moderatorUser.setActive(dto.getActive());
            }

            ModeratorUser updated = moderatorUserService.save(moderatorUser);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating ModeratorUser: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> deleteModeratorUser(@PathVariable Long id) {
        try {
            moderatorUserService.deleteById(id);
            return ResponseEntity.ok("ModeratorUser deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting ModeratorUser: " + e.getMessage());
        }
    }
}
