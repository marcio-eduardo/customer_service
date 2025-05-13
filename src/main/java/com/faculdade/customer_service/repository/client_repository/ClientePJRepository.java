package com.faculdade.customer_service.repository.client_repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.faculdade.customer_service.model.client_model.ClientePJ;

@Repository
public interface ClientePJRepository extends JpaRepository<ClientePJ, Long> {
    // Você pode adicionar métodos personalizados aqui, como buscar por CNPJ, nome, etc.

    // Buscar cliente por CNPJ
    ClientePJ findByCnpj(String cnpj);

    // Buscar clientes por nome fantasia (caso queira permitir pesquisas por nome)
    List<ClientePJ> findByNomeFantasiaContainingIgnoreCase(String nomeFantasia);
}