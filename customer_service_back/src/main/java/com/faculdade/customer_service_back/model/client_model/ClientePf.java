package com.faculdade.customer_service_back.model.client_model;

import jakarta.persistence.*;
import lombok.Setter; // Certifique-se que esta importação está correta para o seu projeto Lombok

import java.time.LocalDate;

@Entity
@Table(name = "clientes_pf")
public class ClientePf {

    @Id
    // Alterado para GenerationType.IDENTITY e removido o generator
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Long id;

    // A anotação @SequenceGenerator foi removida
    // @SequenceGenerator(name = "clientes_pf_seq", sequenceName = "seq_clientes_fisicos", allocationSize = 1)

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
    }

    // Getters
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

    // Se não estiver a usar @Setter do Lombok para todos os campos, adicione os setters aqui.
}
