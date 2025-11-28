package com.faculdade.customer_service_back.controller.auth_controller;

import com.faculdade.customer_service_back.dto.auth.LoginRequest;
import com.faculdade.customer_service_back.dto.auth.SignUpRequest;
import com.faculdade.customer_service_back.dto.auth.JwtResponse;
import com.faculdade.customer_service_back.dto.auth.MessageResponse;
import com.faculdade.customer_service_back.model.admin_model.AdminUser;
import com.faculdade.customer_service_back.model.client_model.Company;
import com.faculdade.customer_service_back.model.client_model.CompanyUser;
import com.faculdade.customer_service_back.model.moderator_model.ModeratorUser;
import com.faculdade.customer_service_back.model.user_model.ERole;
import com.faculdade.customer_service_back.model.user_model.Role;
import com.faculdade.customer_service_back.model.user_model.User;
import com.faculdade.customer_service_back.repository.admin_repository.AdminUserRepository;
import com.faculdade.customer_service_back.repository.client_repository.CompanyRepository;
import com.faculdade.customer_service_back.repository.client_repository.CompanyUserRepository;
import com.faculdade.customer_service_back.repository.moderator_repository.ModeratorUserRepository;
import com.faculdade.customer_service_back.repository.user_repository.RoleRepository;
import com.faculdade.customer_service_back.repository.user_repository.UserRepository;
import com.faculdade.customer_service_back.security.jwt.JwtUtils;
import com.faculdade.customer_service_back.security.services.UserDetailsImpl;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    CompanyUserRepository companyUserRepository;

    @Autowired
    AdminUserRepository adminUserRepository;

    @Autowired
    ModeratorUserRepository moderatorUserRepository;

    @Autowired
    CompanyRepository companyRepository;

    // Endpoint de Login
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> rolesList = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        Long companyUserId = companyUserRepository.findByUserId(userDetails.getId())
                .map(CompanyUser::getId)
                .orElse(null);
        
        Long adminUserId = adminUserRepository.findByUserId(userDetails.getId())
                .map(AdminUser::getId)
                .orElse(null);
        
        Long moderatorUserId = moderatorUserRepository.findByUserId(userDetails.getId())
                .map(ModeratorUser::getId)
                .orElse(null);

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                rolesList,
                companyUserId,
                adminUserId,
                moderatorUserId));
    }

    // Endpoint de Registo
    @PostMapping("/signup")
    @Transactional
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        // Validações
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Erro: Nome de utilizador já está em uso!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Erro: Email já está em uso!"));
        }

        if (signUpRequest.getCpf() != null && !signUpRequest.getCpf().isEmpty() 
                && userRepository.existsByCpf(signUpRequest.getCpf())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Erro: CPF já está em uso!"));
        }

        // Criar User
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));
        
        user.setName(signUpRequest.getName());
        user.setCpf(signUpRequest.getCpf());
        user.setPhone(signUpRequest.getPhone());
        user.setAddress(signUpRequest.getAddress());

        // Atribuir Role
        Set<Role> roles = new HashSet<>();
        String strRole = signUpRequest.getRole();
        Role userRole;
        ERole eRole;

        if (strRole == null || strRole.isEmpty()) {
            eRole = ERole.ROLE_USER;
            userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Erro: Papel ROLE_USER não encontrado."));
        } else {
            switch (strRole.toLowerCase()) {
                case "admin":
                    eRole = ERole.ROLE_ADMIN;
                    userRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Erro: Papel ROLE_ADMIN não encontrado."));
                    break;
                case "mod":
                case "moderator":
                    eRole = ERole.ROLE_MODERATOR;
                    userRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                            .orElseThrow(() -> new RuntimeException("Erro: Papel ROLE_MODERATOR não encontrado."));
                    break;
                default:
                    eRole = ERole.ROLE_USER;
                    userRole = roleRepository.findByName(ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Erro: Papel ROLE_USER não encontrado."));
            }
        }
        roles.add(userRole);
        user.setRoles(roles);
        
        // Salvar User
        User savedUser = userRepository.save(user);

        // Criar perfil específico baseado na role
        try {
            if (eRole == ERole.ROLE_USER) {
                CompanyUser companyUser = new CompanyUser();
                companyUser.setUser(savedUser);
                
                if (signUpRequest.getCompanyId() != null) {
                    Company company = companyRepository.findById(signUpRequest.getCompanyId())
                            .orElse(null);
                    companyUser.setCompany(company);
                }
                
                companyUserRepository.save(companyUser);
                
            } else if (eRole == ERole.ROLE_ADMIN) {
                AdminUser adminUser = new AdminUser();
                adminUser.setUser(savedUser);
                adminUser.setSpecialization(signUpRequest.getSpecialization());
                adminUser.setActive(true);
                
                adminUserRepository.save(adminUser);
                
            } else if (eRole == ERole.ROLE_MODERATOR) {
                ModeratorUser moderatorUser = new ModeratorUser();
                moderatorUser.setUser(savedUser);
                moderatorUser.setDepartment(signUpRequest.getDepartment());
                moderatorUser.setAccessLevel(5);
                moderatorUser.setActive(true);
                
                moderatorUserRepository.save(moderatorUser);
            }
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Erro ao criar perfil: " + e.getMessage()));
        }

        return ResponseEntity.ok(new MessageResponse("Utilizador registado com sucesso!"));
    }
}