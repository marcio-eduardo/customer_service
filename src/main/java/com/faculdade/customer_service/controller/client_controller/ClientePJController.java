package com.faculdade.customer_service.controller.client_controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.faculdade.customer_service.model.client_model.ClientePJ;
import com.faculdade.customer_service.service.client_service.ClientePJService;

import java.net.URI;
import java.util.List;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.EntityExistsException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/clientes-pj")
public class ClientePJController {

    private final ClientePJService clientePJService;

    public ClientePJController(ClientePJService clientePJService) {
        this.clientePJService = clientePJService;
    }

    // Buscar todos os clientes PJ
    @GetMapping
    public ResponseEntity<Page<ClientePJ>> listarTodos(Pageable pageable) {
        Page<ClientePJ> clientes = clientePJService.listarTodos(pageable);
        return ResponseEntity.ok(clientes);
    }

    // Buscar cliente PJ por ID
    @GetMapping("/{id}")
    public ResponseEntity<ClientePJ> buscarPorId(@PathVariable Long id) {
        try {
            ClientePJ cliente = clientePJService.buscarPorId(id);
            return ResponseEntity.ok(cliente);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Buscar cliente PJ por CNPJ
    @GetMapping("/cnpj/{cnpj}")
    public ResponseEntity<ClientePJ> buscarPorCnpj(@PathVariable @jakarta.validation.constraints.Pattern(regexp = "\\d{14}", message = "CNPJ inválido.") String cnpj) {
        ClientePJ cliente = clientePJService.buscarPorCnpj(cnpj);
        return cliente != null ? ResponseEntity.ok(cliente) : ResponseEntity.notFound().build();
    }

    // Criar novo cliente PJ
    @PostMapping
    public ResponseEntity<ClientePJ> salvar(@Valid @RequestBody ClientePJ clientePJ) {
        ClientePJ salvo = clientePJService.salvar(clientePJ);
        return ResponseEntity.created(URI.create("/api/clientes-pj/" + salvo.getId())).body(salvo);
    }

    @PostMapping("/batch")
    public ResponseEntity<Void> salvarEmLote(@Valid @RequestBody List<ClientePJ> clientes) {
        clientes.forEach(clientePJService::salvar);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // Atualizar cliente PJ existente
    @PutMapping("/{id}")
    public ResponseEntity<ClientePJ> atualizar(@PathVariable Long id, @RequestBody ClientePJ clientePJ) {
        try {
            ClientePJ atualizado = clientePJService.atualizar(id, clientePJ);
            return ResponseEntity.ok(atualizado);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Excluir cliente PJ
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        clientePJService.deletar(id);
    }

    @RestControllerAdvice
    public class GlobalExceptionHandler {

        @ExceptionHandler(EntityNotFoundException.class)
        public ResponseEntity<String> handleNotFoundException(EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        @ExceptionHandler(EntityExistsException.class)
        public ResponseEntity<String> handleConflictException(EntityExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}