package com.faculdade.customer_service_back.repository.client_repository;

import com.faculdade.customer_service_back.model.client_model.ClientePJ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientePJRepository extends JpaRepository<ClientePJ, Long> {
    // Você pode adicionar métodos personalizados aqui, como buscar por CNPJ, nome, etc.

    // Buscar cliente por CNPJ
    ClientePJ findByCnpj(String cnpj);

    // Buscar clientes por nome fantasia (caso queira permitir pesquisas por nome)
    List<ClientePJ> findByNomeFantasiaContainingIgnoreCase(String nomeFantasia);

    // Buscar cliente pelo ID do usuário associado
    Optional<ClientePJ> findByUserId(Long userId);
}