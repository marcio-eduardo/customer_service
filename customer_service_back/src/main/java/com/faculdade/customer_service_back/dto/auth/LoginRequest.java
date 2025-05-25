package com.faculdade.customer_service_back.dto.auth;

// Podes adicionar anotações de validação se necessário, como @NotBlank
public class LoginRequest {
    private String username;
    private String password;

    // Getters e Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}