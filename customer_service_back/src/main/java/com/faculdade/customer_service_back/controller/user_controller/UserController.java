package com.faculdade.customer_service_back.controller.user_controller;

import com.faculdade.customer_service_back.dto.auth.MessageResponse;
import com.faculdade.customer_service_back.dto.user.CreateUserRequest;
import com.faculdade.customer_service_back.dto.user.UpdateUserRequest;
import com.faculdade.customer_service_back.dto.user.UserResponse;
import com.faculdade.customer_service_back.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('MODERATOR')")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request) {
        try {
            UserResponse userResponse = userService.createUser(request);
            return ResponseEntity.ok(new MessageResponse("Utilizador criado com sucesso!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Erro: " + e.getMessage()));
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Erro ao criar usuário: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("Erro interno ao criar usuário: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            UserResponse userResponse = userService.getUserById(id);
            return ResponseEntity.ok(userResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        try {
            UserResponse userResponse = userService.updateUser(id, request);
            return ResponseEntity.ok(new MessageResponse("Usuário atualizado com sucesso!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Erro: " + e.getMessage()));
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Erro ao atualizar usuário: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("Erro interno ao atualizar usuário: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(new MessageResponse("Usuário deletado com sucesso!"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/techs")
    @PreAuthorize("hasAnyRole('MODERATOR', 'TECH_USER')")
    public ResponseEntity<List<UserResponse>> getTechUsers() {
        List<UserResponse> users = userService.getAllTechUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/moderators")
    @PreAuthorize("hasAnyRole('MODERATOR', 'TECH_USER')")
    public ResponseEntity<List<UserResponse>> getModerators() {
        List<UserResponse> users = userService.getAllModerators();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('MODERATOR', 'TECH_USER')")
    public ResponseEntity<List<UserResponse>> getUsersByCompany(@PathVariable Long companyId) {
        try {
            List<UserResponse> users = userService.getUsersByCompany(companyId);
            return ResponseEntity.ok(users);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
