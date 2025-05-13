package com.faculdade.customer_service.model.client_model;

import jakarta.persistence.*;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "clientes_pj")
public class ClientePJ {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "clientes_pj_seq")
    @SequenceGenerator(name = "clientes_pj_seq", sequenceName = "seq_clientes_juridicos", allocationSize = 1)
    @Column(name = "id_cliente")
    private Long id;

    @Setter
    @Column(nullable = false)
    private String nomeFantasia;

    @Setter
    @Column(unique = true, nullable = false, length = 18)
    private String cnpj;

    @Setter
    @Column(nullable = false)
    private String razaoSocial;

    @Setter
    private String endereco;

    @Setter
    private String telefone;

    @Setter
    private String email;

    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDate dataCadastro = LocalDate.now();

    // Referência ao responsável (Pessoa Física)
    @Setter
    @ManyToOne
    @JoinColumn(name = "responsavel_id", nullable = false)
    private ClientePf responsavel;

    // Construtores
    public ClientePJ() {}

    public ClientePJ(String nomeFantasia, String cnpj, String razaoSocial, String endereco, String telefone, String email, ClientePf responsavel) {
        this.nomeFantasia = nomeFantasia;
        this.cnpj = cnpj;
        this.razaoSocial = razaoSocial;
        this.endereco = endereco;
        this.telefone = telefone;
        this.email = email;
        this.dataCadastro = LocalDate.now();
        this.responsavel = responsavel;
    }

    // Getters e setters
    public Long getId() {
        return id;
    }

    public String getNomeFantasia() {
        return nomeFantasia;
    }

    public String getCnpj() {
        return cnpj;
    }

    public String getRazaoSocial() {
        return razaoSocial;
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

    public ClientePf getResponsavel() {
        return responsavel;
    }

}