package com.faculdade.customer_service.model.client_model;

import jakarta.persistence.*;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "clientes_pf")
public class ClientePf {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "clientes_pf_seq")
    @SequenceGenerator(name = "clientes_pf_seq", sequenceName = "seq_clientes_fisicos", allocationSize = 1)
    @Column(name = "id_cliente")
    private Long id;

    @Setter
    @Column(nullable = false)
    private String nome;

    @Setter
    @Column(unique = true, nullable = false, length = 14)
    private String cpf;

    @Setter
    private String endereco;
    @Setter
    private String telefone;
    @Setter
    private String email;

    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDate dataCadastro = LocalDate.now();

    // Construtores
    public ClientePf() {}

    public ClientePf(String nome, String cpf, String endereco, String telefone, String email) {
        this.nome = nome;
        this.cpf = cpf;
        this.endereco = endereco;
        this.telefone = telefone;
        this.email = email;
        this.dataCadastro = LocalDate.now();
    }

    // Getters e setters
    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getCpf() {
        return cpf;
    }

    public String getEndereco() {
        return endereco;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getEmail() {
        return email;
    }

    public LocalDate getDataCadastro() {
        return dataCadastro;
    }
}