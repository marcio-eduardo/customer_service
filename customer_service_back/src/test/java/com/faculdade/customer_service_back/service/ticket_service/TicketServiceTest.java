package com.faculdade.customer_service_back.service.ticket_service;

import com.faculdade.customer_service_back.dto.ticket.TicketCloseRequest;
import com.faculdade.customer_service_back.dto.ticket.TicketOpenRequest;
import com.faculdade.customer_service_back.model.company_model.Company;
import com.faculdade.customer_service_back.model.ticket_model.TicketModel;
import com.faculdade.customer_service_back.model.ticket_model.TicketPriority;
import com.faculdade.customer_service_back.model.ticket_model.TicketStatus;
import com.faculdade.customer_service_back.model.user_model.ERole;
import com.faculdade.customer_service_back.model.user_model.Role;
import com.faculdade.customer_service_back.model.user_model.User;
import com.faculdade.customer_service_back.repository.company_repository.CompanyRepository;
import com.faculdade.customer_service_back.repository.ticket_repository.TicketRepository;
import com.faculdade.customer_service_back.repository.user_repository.UserRepository;
import com.faculdade.customer_service_back.security.services.UserDetailsImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private TicketService ticketService;

    private User user;
    private User techUser;
    private Company company;
    private TicketModel ticket;

    @BeforeEach
    void setUp() {
        company = new Company();
        company.setId(1L);
        company.setSlaHours(24);

        user = new User("user", "user@email.com", "pass", "User", "Test");
        user.setId(1L);
        user.setCompany(company);
        user.setRoles(new HashSet<>(Collections.singletonList(new Role(ERole.ROLE_COMPANY_USER))));

        techUser = new User("tech", "tech@email.com", "pass", "Tech", "User");
        techUser.setId(2L);
        techUser.setRoles(new HashSet<>(Collections.singletonList(new Role(ERole.ROLE_TECH_USER))));

        ticket = new TicketModel();
        ticket.setId(100L);
        ticket.setTitle("Issue");
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCompany(company);
        ticket.setOpenedBy(user);
        ticket.setCreatedAt(LocalDateTime.now());

        // Mock Security Context
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "user", "user@email.com", "pass",
                Collections.emptyList());
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        SecurityContextHolder.setContext(securityContext);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void testOpenTicket_Success() {
        TicketOpenRequest request = new TicketOpenRequest();
        request.setTitle("New Issue");
        request.setDescription("Help needed");
        request.setPriority(TicketPriority.ALTA);
        request.setCompanyId(1L);

        when(userRepository.findByIdWithCompany(1L)).thenReturn(Optional.of(user));
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(ticketRepository.save(any(TicketModel.class))).thenReturn(ticket);

        TicketModel created = ticketService.openTicket(request);

        assertNotNull(created);
        verify(ticketRepository, times(1)).save(any(TicketModel.class));
    }

    @Test
    void testCloseTicket_Success() {
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        TicketCloseRequest closeRequest = new TicketCloseRequest();
        closeRequest.setResolutionNotes("Fixed");
        closeRequest.setRating(5);

        when(ticketRepository.findById(100L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(TicketModel.class))).thenReturn(ticket);

        TicketModel closed = ticketService.closeTicket(100L, closeRequest);

        verify(ticketRepository).save(ticket);
        assertEquals(TicketStatus.RESOLVED, ticket.getStatus());
        assertEquals("Fixed", ticket.getResolutionNotes());
    }

    @Test
    void testAssignTicket_Success() {
        // Change context to Tech User
        UserDetailsImpl techDetails = new UserDetailsImpl(2L, "tech", "tech@email.com", "pass",
                Collections.emptyList());
        when(authentication.getPrincipal()).thenReturn(techDetails);
        when(userRepository.findById(2L)).thenReturn(Optional.of(techUser));

        when(ticketRepository.findById(100L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(TicketModel.class))).thenReturn(ticket);

        TicketModel assigned = ticketService.assignTicket(100L);

        assertEquals(techUser, ticket.getAssignedTo());
        assertEquals(TicketStatus.IN_PROGRESS, ticket.getStatus());
    }
}
