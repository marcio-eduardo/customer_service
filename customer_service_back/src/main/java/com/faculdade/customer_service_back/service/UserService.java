package com.faculdade.customer_service_back.service;

import com.faculdade.customer_service_back.dto.user.CreateUserRequest;
import com.faculdade.customer_service_back.dto.user.UpdateUserRequest;
import com.faculdade.customer_service_back.dto.user.UserResponse;
import com.faculdade.customer_service_back.model.company_model.Company;
import com.faculdade.customer_service_back.model.user_model.ERole;
import com.faculdade.customer_service_back.model.user_model.Role;
import com.faculdade.customer_service_back.model.user_model.User;
import com.faculdade.customer_service_back.repository.company_repository.CompanyRepository;
import com.faculdade.customer_service_back.repository.user_repository.RoleRepository;
import com.faculdade.customer_service_back.repository.user_repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Nome de utilizador já está em uso!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email já está em uso!");
        }

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                encoder.encode(request.getPassword()),
                request.getFirstName(),
                request.getLastName());

        Set<Role> roles = new HashSet<>();
        String strRole = request.getRole();

        if (strRole == null || strRole.isEmpty()) {
            throw new IllegalArgumentException("O papel do usuário é obrigatório.");
        }

        Role userRole = getRoleByName(strRole);
        roles.add(userRole);
        user.setRoles(roles);

        // Se for company_user, associar empresa
        if (userRole.getName().equals(ERole.ROLE_COMPANY_USER)) {
            if (request.getCompanyId() == null) {
                throw new IllegalArgumentException("O ID da empresa é obrigatório para usuários da empresa.");
            }
            Company company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new RuntimeException("Empresa não encontrada."));
            user.setCompany(company);
        }

        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        return new UserResponse(user);
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        // Atualizar username se fornecido
        if (request.getUsername() != null && !request.getUsername().isEmpty()) {
            if (!user.getUsername().equals(request.getUsername()) &&
                    userRepository.existsByUsername(request.getUsername())) {
                throw new IllegalArgumentException("Nome de utilizador já está em uso!");
            }
            user.setUsername(request.getUsername());
        }

        // Atualizar email se fornecido
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            if (!user.getEmail().equals(request.getEmail()) &&
                    userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email já está em uso!");
            }
            user.setEmail(request.getEmail());
        }

        // Atualizar firstName se fornecido
        if (request.getFirstName() != null && !request.getFirstName().isEmpty()) {
            user.setFirstName(request.getFirstName());
        }

        // Atualizar lastName se fornecido
        if (request.getLastName() != null && !request.getLastName().isEmpty()) {
            user.setLastName(request.getLastName());
        }

        // Atualizar senha se fornecida
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(encoder.encode(request.getPassword()));
        }

        // Atualizar role se fornecido
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            Role userRole = getRoleByName(request.getRole());
            roles.add(userRole);
            user.setRoles(roles);

            // Se for company_user, exigir empresa
            if (userRole.getName().equals(ERole.ROLE_COMPANY_USER)) {
                if (request.getCompanyId() == null) {
                    if (user.getCompany() == null) {
                        throw new IllegalArgumentException("O ID da empresa é obrigatório para usuários da empresa.");
                    }
                } else {
                    Company company = companyRepository.findById(request.getCompanyId())
                            .orElseThrow(() -> new RuntimeException("Empresa não encontrada."));
                    user.setCompany(company);
                }
            } else {
                // Técnicos e moderadores não têm empresa
                user.setCompany(null);
            }
        } else if (request.getCompanyId() != null) {
            // Atualizar apenas a empresa se fornecida (sem mudar role)
            Company company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new RuntimeException("Empresa não encontrada."));
            user.setCompany(company);
        }

        User updatedUser = userRepository.save(user);
        return new UserResponse(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado.");
        }
        userRepository.deleteById(id);
    }

    private Role getRoleByName(String strRole) {
        switch (strRole.toUpperCase()) {
            case "COMPANY_USER":
                return roleRepository.findByName(ERole.ROLE_COMPANY_USER)
                        .orElseThrow(() -> new RuntimeException("Papel ROLE_COMPANY_USER não encontrado."));

            case "TECH_USER":
                return roleRepository.findByName(ERole.ROLE_TECH_USER)
                        .orElseThrow(() -> new RuntimeException("Papel ROLE_TECH_USER não encontrado."));

            case "MODERATOR_USER":
                return roleRepository.findByName(ERole.ROLE_MODERATOR)
                        .orElseThrow(() -> new RuntimeException("Papel ROLE_MODERATOR não encontrado."));

            default:
                throw new IllegalArgumentException(
                        "Papel '" + strRole + "' não é válido. Use: COMPANY_USER, TECH_USER, ou MODERATOR_USER.");
        }
    }

    public List<UserResponse> getAllTechUsers() {
        List<User> techUsers = userRepository.findByRoles_Name(ERole.ROLE_TECH_USER);
        return techUsers.stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getAllModerators() {
        List<User> moderators = userRepository.findByRoles_Name(ERole.ROLE_MODERATOR);
        return moderators.stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getUsersByCompany(Long companyId) {
        if (!companyRepository.existsById(companyId)) {
            throw new RuntimeException("Empresa não encontrada.");
        }
        List<User> users = userRepository.findAllByCompany_Id(companyId);
        return users.stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }
}
