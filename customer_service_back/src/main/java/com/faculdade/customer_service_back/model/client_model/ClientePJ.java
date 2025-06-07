package com.faculdade.customer_service_back.model.client_model;

import jakarta.persistence.*;
import lombok.Setter; // Certifique-se que esta importação está correta para o seu projeto Lombok

import java.time.LocalDate;

@Entity
@Table(name = "clientes_pj")
public class ClientePJ {

    @Id
    // Alterado para GenerationType.IDENTITY e removido o generator
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Long id;

    // A anotação @SequenceGenerator foi removida
    // @SequenceGenerator(name = "clientes_pj_seq", sequenceName = "seq_clientes_juridicos", allocationSize = 1)

    @Setter
    @Column(nullable = false)
    private String nomeFantasia;

    @Setter
    @Column(unique = true, nullable = false, length = 18) // CNPJ no Brasil tem 14 dígitos, 18 permite máscara
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
    private LocalDate dataCadastro = LocalDate.now(); // Inicializa com a data atual

    // Referência ao responsável (Pessoa Física)
    @Setter
    @ManyToOne // Assumindo que um ClientePJ tem um ClientePf como responsável
    @JoinColumn(name = "responsavel_id", nullable = false) // Garante que o responsável é obrigatório
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
        this.responsavel = responsavel;
        // this.dataCadastro já é inicializado por defeito
    }

    // Getters (os setters são gerados pelo Lombok ou podem ser adicionados manualmente)
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

    // Se não estiver a usar @Setter do Lombok para todos os campos, adicione os setters aqui.
    // public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }
    // public void setCnpj(String cnpj) { this.cnpj = cnpj; }
    // public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }
    // public void setEndereco(String endereco) { this.endereco = endereco; }
    // public void setTelefone(String telefone) { this.telefone = telefone; }
    // public void setEmail(String email) { this.email = email; }
    // public void setResponsavel(ClientePf responsavel) { this.responsavel = responsavel; }
}
