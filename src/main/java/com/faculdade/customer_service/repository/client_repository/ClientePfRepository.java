package com.faculdade.customer_service.repository.client_repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.faculdade.customer_service.model.client_model.ClientePf;

@Repository
public interface ClientePfRepository extends JpaRepository<ClientePf, Long> {
    // Você pode adicionar métodos personalizados aqui, como buscar por CPF, nome, etc.

    // Buscar cliente por CPF
    ClientePf findByCpf(String cpf);

    // Buscar clientes por nome (caso queira permitir pesquisas por nome)
    List<ClientePf> findByNomeContainingIgnoreCase(String nome);

}
