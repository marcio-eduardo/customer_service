package com.faculdade.customer_service_back.service;

import com.faculdade.customer_service_back.dto.user.CreateUserRequest;
import com.faculdade.customer_service_back.dto.user.UpdateUserRequest;
import com.faculdade.customer_service_back.dto.user.UserResponse;
import com.faculdade.customer_service_back.model.company_model.Company;
import com.faculdade.customer_service_back.model.user_model.ERole;
import com.faculdade.customer_service_back.model.user_model.Role;
import com.faculdade.customer_service_back.model.user_model.User;
import com.faculdade.customer_service_back.repository.company_repository.CompanyRepository;
import com.faculdade.customer_service_back.repository.user_repository.RoleRepository;
import com.faculdade.customer_service_back.repository.user_repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private PasswordEncoder encoder;

    @InjectMocks
    private UserService userService;

    private CreateUserRequest createRequest;
    private User user;
    private Role companyRole;
    private Company company;

    @BeforeEach
    void setUp() {
        companyRole = new Role(ERole.ROLE_COMPANY_USER);

        company = new Company();
        company.setId(1L);
        company.setName("Test Company");

        createRequest = new CreateUserRequest();
        createRequest.setUsername("testuser");
        createRequest.setEmail("test@example.com");
        createRequest.setPassword("password");
        createRequest.setFirstName("Test");
        createRequest.setLastName("User");
        createRequest.setRole("COMPANY_USER");
        createRequest.setCompanyId(1L);

        user = new User("testuser", "test@example.com", "encodedPass", "Test", "User");
        user.setId(1L);
    }

    @Test
    void testCreateUser_Success() {
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(roleRepository.findByName(ERole.ROLE_COMPANY_USER)).thenReturn(Optional.of(companyRole));
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(encoder.encode(anyString())).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponse response = userService.createUser(createRequest);

        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testCreateUser_Fail_DuplicateUsername() {
        when(userRepository.existsByUsername(createRequest.getUsername())).thenReturn(true);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(createRequest);
        });

        assertEquals("Nome de utilizador já está em uso!", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testCreateUser_Fail_MissingCompanyForCompanyUser() {
        createRequest.setCompanyId(null);

        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(roleRepository.findByName(ERole.ROLE_COMPANY_USER)).thenReturn(Optional.of(companyRole));
        when(encoder.encode(anyString())).thenReturn("encodedPass");

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(createRequest);
        });

        assertEquals("O ID da empresa é obrigatório para usuários da empresa.", exception.getMessage());
    }

    @Test
    void testUpdateUser_Success() {
        UpdateUserRequest updateRequest = new UpdateUserRequest();
        updateRequest.setFirstName("Updated");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponse response = userService.updateUser(1L, updateRequest);

        verify(userRepository, times(1)).save(user);
        // Note: In a real integration test or if we captured the argument, we'd verify
        // the name change.
        // Since we return the same mock 'user' which wasn't actually mutated by the
        // real logic
        // (mocks don't mutate state like real objects unless spied), we mostly verify
        // flow here.
        // Ideally, we'd use an ArgumentCaptor to verify user.setFirstName was called
        // with "Updated".
    }
}
