package com.faculdade.customer_service_back.repository.client_repository;

import com.faculdade.customer_service_back.model.client_model.ClientePf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientePfRepository extends JpaRepository<ClientePf, Long> {
    // Você pode adicionar métodos personalizados aqui, como buscar por CPF, nome, etc.

    // Buscar cliente por CPF
    ClientePf findByCpf(String cpf);

    // Buscar clientes por nome (caso queira permitir pesquisas por nome)
    List<ClientePf> findByNomeContainingIgnoreCase(String nome);

    // Buscar cliente pelo ID do usuário associado
    Optional<ClientePf> findByUserId(Long userId);
}

