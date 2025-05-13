package com.faculdade.customer_service.service.client_service;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.faculdade.customer_service.model.client_model.ClientePJ;
import com.faculdade.customer_service.repository.client_repository.ClientePJRepository;

@Service
public class ClientePJService {

    @Autowired
    private ClientePJRepository clientePJRepository;

    // Listar clientes PJ com paginação
    public Page<ClientePJ> listarTodos(Pageable pageable) {
        return clientePJRepository.findAll(pageable);
    }

    // Buscar cliente PJ por ID
    public ClientePJ buscarPorId(Long id) {
        return clientePJRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente PJ não encontrado com ID: " + id));
    }

    // Buscar cliente PJ por CNPJ
    public ClientePJ buscarPorCnpj(String cnpj) {
        return clientePJRepository.findByCnpj(cnpj);
    }

    // Salvar um novo cliente PJ, garantindo CNPJ único
    public ClientePJ salvar(ClientePJ clientePJ) {
        if (clientePJRepository.findByCnpj(clientePJ.getCnpj()) != null) {
            throw new EntityExistsException("CNPJ já cadastrado: " + clientePJ.getCnpj());
        }
        return clientePJRepository.save(clientePJ);
    }

    // Atualizar cliente PJ existente
    public ClientePJ atualizar(Long id, ClientePJ clientePJAtualizado) {
        ClientePJ clienteExistente = buscarPorId(id);
        clienteExistente.setNomeFantasia(clientePJAtualizado.getNomeFantasia());
        clienteExistente.setRazaoSocial(clientePJAtualizado.getRazaoSocial());
        clienteExistente.setEndereco(clientePJAtualizado.getEndereco());
        clienteExistente.setTelefone(clientePJAtualizado.getTelefone());
        clienteExistente.setEmail(clientePJAtualizado.getEmail());
        clienteExistente.setResponsavel(clientePJAtualizado.getResponsavel());
        return clientePJRepository.save(clienteExistente);
    }

    // Excluir cliente PJ
    public void deletar(Long id) {
        ClientePJ cliente = buscarPorId(id);
        clientePJRepository.delete(cliente);
    }
}