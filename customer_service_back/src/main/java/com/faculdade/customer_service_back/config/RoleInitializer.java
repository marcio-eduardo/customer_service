package com.faculdade.customer_service_back.config;

import com.faculdade.customer_service_back.model.user_model.ERole;
import com.faculdade.customer_service_back.model.user_model.Role;
import com.faculdade.customer_service_back.model.user_model.User;
import com.faculdade.customer_service_back.repository.user_repository.RoleRepository;
import com.faculdade.customer_service_back.repository.user_repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Component
public class RoleInitializer {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initialize() {
        initializeRoles();
        createModeratorUserIfNotExists();
    }

    private void initializeRoles() {
        addRoleIfNotExists(ERole.ROLE_COMPANY_USER);
        addRoleIfNotExists(ERole.ROLE_TECH_USER);
        addRoleIfNotExists(ERole.ROLE_MODERATOR);
    }

    private void addRoleIfNotExists(ERole roleName) {
        if (roleRepository.findByName(roleName).isEmpty()) {
            Role role = new Role(roleName);
            roleRepository.save(role);
            System.out.println("Papel " + roleName + " criado com sucesso!");
        }
    }

    private void createModeratorUserIfNotExists() {
        if (userRepository.findByRoles_Name(ERole.ROLE_MODERATOR).isEmpty()) {
            Role moderatorRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                    .orElseThrow(() -> new RuntimeException("Erro: Papel ROLE_MODERATOR não encontrado."));

            User moderator = new User();
            moderator.setUsername("moderator");
            moderator.setEmail("moderator@tas.com");
            moderator.setPassword(passwordEncoder.encode("moderator")); // Changed password to "modarator"

            Set<Role> roles = new HashSet<>();
            roles.add(moderatorRole);
            moderator.setRoles(roles);

            userRepository.save(moderator);
            System.out.println("Usuário MODERATOR criado com sucesso!");
        }
    }
}