package com.faculdade.customer_service_back.model.client_model;

import com.faculdade.customer_service_back.model.user_model.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "clientes_pj")
@Data
public class ClientePJ {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Long id;

    @Column(nullable = false)
    private String nomeFantasia;

    @Column(unique = true, nullable = false, length = 18)
    private String cnpj;

    @Column(nullable = false)
    private String razaoSocial;

    private String endereco;

    private String telefone;

    private String email;

    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDate dataCadastro = LocalDate.now();

    @ManyToOne
    @JoinColumn(name = "responsavel_id", nullable = false)
    private ClientePf responsavel;

    public ClientePJ() {}

    public ClientePJ(String nomeFantasia, String cnpj, String razaoSocial, String endereco, String telefone, String email, ClientePf responsavel) {
        this.nomeFantasia = nomeFantasia;
        this.cnpj = cnpj;
        this.razaoSocial = razaoSocial;
        this.endereco = endereco;
        this.telefone = telefone;
        this.email = email;
        this.responsavel = responsavel;
    }
}
