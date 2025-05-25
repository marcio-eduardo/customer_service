package com.faculdade.customer_service_back.config;

import com.faculdade.customer_service_back.model.user_model.ERole;
import com.faculdade.customer_service_back.model.user_model.Role;
import com.faculdade.customer_service_back.repository.user_repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.Optional;

@Component
public class RoleInitializer {

    @Autowired
    RoleRepository roleRepository;

    @PostConstruct
    public void initializeRoles() {
        addRoleIfNotExists(ERole.ROLE_USER);
        addRoleIfNotExists(ERole.ROLE_ADMIN);
        addRoleIfNotExists(ERole.ROLE_MODERATOR);
    }

    private void addRoleIfNotExists(ERole roleName) {
        Optional<Role> existingRole = roleRepository.findByName(roleName);
        if (existingRole.isEmpty()) {
            Role role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
            System.out.println("Papel " + roleName + " criado com sucesso!");
        }
    }
}