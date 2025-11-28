package com.faculdade.customer_service_back.controller.user_controller;

import com.faculdade.customer_service_back.dto.auth.MessageResponse;
import com.faculdade.customer_service_back.dto.user.CreateUserRequest;
import com.faculdade.customer_service_back.model.company_model.Company;
import com.faculdade.customer_service_back.model.user_model.ERole;
import com.faculdade.customer_service_back.model.user_model.Role;
import com.faculdade.customer_service_back.model.user_model.User;
import com.faculdade.customer_service_back.repository.company_repository.CompanyRepository;
import com.faculdade.customer_service_back.repository.user_repository.RoleRepository;
import com.faculdade.customer_service_back.repository.user_repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('MODERATOR')")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PasswordEncoder encoder;

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request) {
        try {
            // Validações básicas
            if (userRepository.existsByUsername(request.getUsername())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Erro: Nome de utilizador já está em uso!"));
            }

            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Erro: Email já está em uso!"));
            }

            // Criar novo usuário
            User user = new User(
                    request.getUsername(),
                    request.getEmail(),
                    encoder.encode(request.getPassword())
            );

            Set<Role> roles = new HashSet<>();
            String strRole = request.getRole();
            
            if (strRole == null || strRole.isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Erro: O papel do usuário é obrigatório."));
            }

            Role userRole;

            // Determinar o papel baseado no role fornecido
            switch (strRole.toLowerCase()) {
                case "company_user":
                    userRole = roleRepository.findByName(ERole.ROLE_COMPANY_USER)
                            .orElseThrow(() -> new RuntimeException("Erro: Papel ROLE_COMPANY_USER não encontrado."));
                    if (request.getCompanyId() == null) {
                        return ResponseEntity.badRequest().body(new MessageResponse("Erro: O ID da empresa é obrigatório para usuários da empresa."));
                    }
                    Company company = companyRepository.findById(request.getCompanyId())
                            .orElseThrow(() -> new RuntimeException("Erro: Empresa não encontrada."));
                    user.setCompany(company);
                    break;
                    
                case "tech":
                case "tech_user":
                    userRole = roleRepository.findByName(ERole.ROLE_TECH_USER)
                            .orElseThrow(() -> new RuntimeException("Erro: Papel ROLE_TECH_USER não encontrado."));
                    break;
                    
                case "mod":
                case "moderator":
                    userRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                            .orElseThrow(() -> new RuntimeException("Erro: Papel ROLE_MODERATOR não encontrado."));
                    break;
                    
                default:
                    return ResponseEntity.badRequest().body(new MessageResponse("Erro: Papel '" + strRole + "' não é válido. Use: company_user, tech, ou moderator."));
            }
            
            roles.add(userRole);
            user.setRoles(roles);

            userRepository.save(user);

            return ResponseEntity.ok(new MessageResponse("Utilizador criado com sucesso!"));
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Erro ao criar usuário: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(new MessageResponse("Erro interno ao criar usuário: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Usuário deletado com sucesso!"));
    }
}
