package com.faculdade.customer_service.controller.client_controller;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.faculdade.customer_service.model.client_model.ClientePf;
import com.faculdade.customer_service.service.client_service.ClientePfService;

import java.net.URI;
import java.util.List;
//import java.util.List;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.EntityExistsException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/clientes-pf")
public class ClientePfController {

     private final ClientePfService clientePfService;

     public ClientePfController(ClientePfService clientePfService) {
         this.clientePfService = clientePfService;
     }

    // Buscar todos os clientes
     @GetMapping
     public ResponseEntity<Page<ClientePf>> listarTodos(Pageable pageable) {
         Page<ClientePf> clientes = clientePfService.listarTodos(pageable);
         return ResponseEntity.ok(clientes);
     }

    // Buscar cliente por ID
    @GetMapping("/{id}")
    public ResponseEntity<ClientePf> buscarPorId(@PathVariable Long id) {
        try {
            ClientePf cliente = clientePfService.buscarPorId(id);
            return ResponseEntity.ok(cliente);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

     @GetMapping("/cpf/{cpf}")
     public ResponseEntity<ClientePf> buscarPorCpf(@PathVariable @jakarta.validation.constraints.Pattern(regexp = "\\d{11}", message = "CPF inválido.") String cpf) {
         ClientePf cliente = clientePfService.buscarPorCpf(cpf);
         return cliente != null ? ResponseEntity.ok(cliente) : ResponseEntity.notFound().build();
     }

    // Criar novo cliente
     @PostMapping
     public ResponseEntity<ClientePf> salvar(@Valid @RequestBody ClientePf clientePf) {
         ClientePf salvo = clientePfService.salvar(clientePf);
         return ResponseEntity.created(URI.create("/api/clientes-pf/" + salvo.getId())).body(salvo);
     }

    @PostMapping("/batch")
    public ResponseEntity<Void> salvarEmLote(@Valid @RequestBody List<ClientePf> clientes) {
        clientes.forEach(clientePfService::salvar);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    // Atualizar cliente existente
    @PutMapping("/{id}")
    public ResponseEntity<ClientePf> atualizar(@PathVariable Long id, @RequestBody ClientePf clientePf) {
        try {
            ClientePf atualizado = clientePfService.atualizar(id, clientePf);
            return ResponseEntity.ok(atualizado);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

     @DeleteMapping("/{id}")
     @ResponseStatus(HttpStatus.NO_CONTENT)
     public void deletar(@PathVariable Long id) {
         clientePfService.deletar(id);
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