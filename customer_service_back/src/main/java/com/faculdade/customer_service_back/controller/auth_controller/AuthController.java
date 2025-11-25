package com.faculdade.customer_service_back.controller.auth_controller;

import com.faculdade.customer_service_back.dto.auth.LoginRequest;
import com.faculdade.customer_service_back.dto.auth.SignUpRequest;
import com.faculdade.customer_service_back.dto.auth.JwtResponse;
import com.faculdade.customer_service_back.dto.auth.MessageResponse;
import com.faculdade.customer_service_back.model.client_model.ClientePf;
import com.faculdade.customer_service_back.model.user_model.ERole;
import com.faculdade.customer_service_back.model.user_model.Role;
import com.faculdade.customer_service_back.model.user_model.User;
import com.faculdade.customer_service_back.repository.client_repository.ClientePfRepository;
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
    ClientePfRepository clientePfRepository; // Injetado

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Erro: Nome de utilizador já está em uso!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Erro: Email já está em uso!"));
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<Role> roles = new HashSet<>();
        String strRole = signUpRequest.getRole();
        Role userRole;

        if (strRole == null || strRole.isEmpty() || strRole.equalsIgnoreCase("user")) {
            userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Erro: Papel ROLE_USER não encontrado."));
        } else {
            switch (strRole.toLowerCase()) {
                case "admin":
                    userRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Erro: Papel ROLE_ADMIN não encontrado."));
                    break;
                case "mod":
                case "moderator":
                    userRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                            .orElseThrow(() -> new RuntimeException("Erro: Papel ROLE_MODERATOR não encontrado."));
                    break;
                default:
                    return ResponseEntity.badRequest().body(new MessageResponse("Erro: Papel '" + strRole + "' não é válido."));
            }
        }
        roles.add(userRole);
        user.setRoles(roles);
        
        // Salva o User primeiro para obter o ID
        User savedUser = userRepository.save(user);

        // Se for um utilizador padrão, cria também a entidade ClientePf
        if (userRole.getName() == ERole.ROLE_USER) {
            if (signUpRequest.getNome() == null || signUpRequest.getCpf() == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Erro: Nome e CPF são obrigatórios para utilizadores."));
            }
            ClientePf clientePf = new ClientePf();
            clientePf.setNome(signUpRequest.getNome());
            clientePf.setCpf(signUpRequest.getCpf());
            clientePf.setEmail(signUpRequest.getEmail());
            clientePf.setUser(savedUser); // Associa o User ao ClientePf
            clientePfRepository.save(clientePf);
        }

        return ResponseEntity.ok(new MessageResponse("Utilizador registado com sucesso!"));
    }
}