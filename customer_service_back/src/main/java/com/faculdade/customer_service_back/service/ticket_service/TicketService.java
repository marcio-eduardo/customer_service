package com.faculdade.customer_service_back.service.ticket_service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.faculdade.customer_service_back.model.client_model.ClientePf;
import com.faculdade.customer_service_back.model.client_model.ClientePJ;
import com.faculdade.customer_service_back.model.technical_model.Technical;
import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.model.ticket_model.TicketOpenRequest;
import com.faculdade.customer_service_back.model.ticket_model.TicketStatus;
import com.faculdade.customer_service_back.repository.client_repository.ClientePfRepository;
import com.faculdade.customer_service_back.repository.client_repository.ClientePJRepository;
import com.faculdade.customer_service_back.repository.technical_repository.TechnicalRepository;
import com.faculdade.customer_service_back.repository.ticket_repository.TicketRepository;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TechnicalRepository technicalRepository;
    private final ClientePfRepository clientePfRepository; // Repositório de Cliente PF
    private final ClientePJRepository clientePjRepository; // Repositório de Cliente PJ

    // Construtor atualizado com as novas dependências
    public TicketService(TicketRepository ticketRepository,
                         TechnicalRepository technicalRepository,
                         ClientePfRepository clientePfRepository,
                         ClientePJRepository clientePjRepository) {
        this.ticketRepository = ticketRepository;
        this.technicalRepository = technicalRepository;
        this.clientePfRepository = clientePfRepository;
        this.clientePjRepository = clientePjRepository;
    }

    // Método para abrir chamado, agora associando a um cliente
    public TicketModel openTicket(TicketOpenRequest request) {
        TicketModel ticket = new TicketModel();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());

        // Lógica para associar o chamado ao cliente correto
        if (request.getClientePfId() != null) {
            ClientePf cliente = clientePfRepository.findById(request.getClientePfId())
                    .orElseThrow(() -> new RuntimeException("Cliente PF nao encontrado com o ID: " + request.getClientePfId()));
            ticket.setClientePf(cliente);
        } else if (request.getClientePjId() != null) {
            ClientePJ cliente = clientePjRepository.findById(request.getClientePjId())
                    .orElseThrow(() -> new RuntimeException("Cliente PJ nao encontrado com o ID: " + request.getClientePjId()));
            ticket.setClientePj(cliente);
        } else {
            // Se nenhum ID de cliente for fornecido, a requisição é inválida
            throw new IllegalArgumentException("É necessário fornecer o ID de um Cliente PF ou PJ para abrir um chamado.");
        }

        // A atribuição inicial a um técnico foi removida. O ticket é criado sem técnico.
        // A lógica de atribuição será um passo separado.
        // ticket.setTechnical(technical);

        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    // Metodo para fechar chamado com detalhes de resolução
    public TicketModel closeTicket(Long ticketId, Long closedByTechnicalId, String resolutionNotes) {
        TicketModel ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + ticketId));

        Technical technical = technicalRepository.findById(closedByTechnicalId)
                .orElseThrow(() -> new RuntimeException("Technical not found with ID: " + closedByTechnicalId));

        ticket.setStatus(TicketStatus.RESOLVED);
        ticket.setResolvedAt(LocalDateTime.now());
        ticket.setClosedByTechnical(technical);
        ticket.setResolutionNotes(resolutionNotes);

        return ticketRepository.save(ticket);
    }

    // Metodo para buscar um chamado por ID
    public Optional<TicketModel> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    // Metodo para listar todos os chamados
    public List<TicketModel> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Metodo para listar chamados abertos
    public List<TicketModel> getOpenTickets() {
        return ticketRepository.findOpenTickets();
    }

    // Metodo para listar chamados fechados
    public List<TicketModel> getResolvedTickets() {
        return ticketRepository.findResolvedTickets();
    }
}
