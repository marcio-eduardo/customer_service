package com.faculdade.customer_service.service.client_service;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.faculdade.customer_service.model.client_model.ClientePf;
import com.faculdade.customer_service.repository.client_repository.ClientePfRepository;

@Service
public class ClientePfService {

    @Autowired
    private ClientePfRepository clientePfRepository;

    // Listar clientes com paginação
    public Page<ClientePf> listarTodos(Pageable pageable) {
        return clientePfRepository.findAll(pageable);
    }

    // Buscar cliente por ID
    public ClientePf buscarPorId(Long id) {
        return clientePfRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado com ID: " + id));
    }

    // Buscar cliente por CPF
    public ClientePf buscarPorCpf(String cpf) {
        return clientePfRepository.findByCpf(cpf);
    }

    // Salvar um novo cliente, garantindo CPF único
    public ClientePf salvar(ClientePf clientePf) {
        if (clientePfRepository.findByCpf(clientePf.getCpf()) != null) {
            throw new EntityExistsException("CPF já cadastrado: " + clientePf.getCpf());
        }
        return clientePfRepository.save(clientePf);
    }

    // Atualizar cliente existente
    public ClientePf atualizar(Long id, ClientePf clientePfAtualizado) {
        ClientePf clienteExistente = buscarPorId(id);
        clienteExistente.setNome(clientePfAtualizado.getNome());
        clienteExistente.setEndereco(clientePfAtualizado.getEndereco());
        clienteExistente.setTelefone(clientePfAtualizado.getTelefone());
        clienteExistente.setEmail(clientePfAtualizado.getEmail());
        return clientePfRepository.save(clienteExistente);
    }

    // Excluir cliente
    public void deletar(Long id) {
        ClientePf cliente = buscarPorId(id);
        clientePfRepository.delete(cliente);
    }
}