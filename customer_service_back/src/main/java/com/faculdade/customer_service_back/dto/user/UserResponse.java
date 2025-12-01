package com.faculdade.customer_service_back.dto.user;

import com.faculdade.customer_service_back.model.user_model.Role;
import com.faculdade.customer_service_back.model.user_model.User;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class UserResponse {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private Set<String> roles;
    private Long companyId;
    private String companyName;

    public UserResponse() {
    }

    public UserResponse(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());

        if (user.getCompany() != null) {
            this.companyId = user.getCompany().getId();
            this.companyName = user.getCompany().getName();
        }
    }
}
