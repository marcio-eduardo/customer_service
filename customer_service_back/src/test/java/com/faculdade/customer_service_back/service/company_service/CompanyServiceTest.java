package com.faculdade.customer_service_back.service.company_service;

import com.faculdade.customer_service_back.dto.company.CompanyRequest;
import com.faculdade.customer_service_back.dto.company.CompanyResponse;
import com.faculdade.customer_service_back.model.company_model.Company;
import com.faculdade.customer_service_back.repository.company_repository.CompanyRepository;
import com.faculdade.customer_service_back.repository.user_repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CompanyServiceTest {

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CompanyService companyService;

    private CompanyRequest companyRequest;
    private Company company;

    @BeforeEach
    void setUp() {
        companyRequest = new CompanyRequest();
        companyRequest.setName("Tech Corp");
        companyRequest.setCnpj("12.345.678/0001-90");
        companyRequest.setEmail("contact@techcorp.com");
        companyRequest.setPhone("11999999999");
        companyRequest.setAddress("Street 1");
        companyRequest.setSlaHours(48);

        company = new Company();
        company.setId(1L);
        company.setName("Tech Corp");
        company.setCnpj("12.345.678/0001-90");
        company.setEmail("contact@techcorp.com");
    }

    @Test
    void testCreateCompany_Success() {
        when(companyRepository.findByCnpj(anyString())).thenReturn(Optional.empty());
        when(companyRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(companyRepository.save(any(Company.class))).thenReturn(company);

        CompanyResponse response = companyService.createCompany(companyRequest);

        assertNotNull(response);
        assertEquals("Tech Corp", response.getName());
        verify(companyRepository, times(1)).save(any(Company.class));
    }

    @Test
    void testCreateCompany_Fail_DuplicateCnpj() {
        when(companyRepository.findByCnpj(companyRequest.getCnpj())).thenReturn(Optional.of(company));

        Exception exception = assertThrows(RuntimeException.class, () -> {
            companyService.createCompany(companyRequest);
        });

        assertEquals("Já existe uma empresa cadastrada com este CNPJ", exception.getMessage());
        verify(companyRepository, never()).save(any(Company.class));
    }

    @Test
    void testDeleteCompany_Fail_HasUsers() {
        when(companyRepository.existsById(1L)).thenReturn(true);
        when(userRepository.countByCompanyId(1L)).thenReturn(5L);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            companyService.deleteCompany(1L);
        });

        assertTrue(exception.getMessage().contains("existem 5 usuário(s) vinculado(s)"));
        verify(companyRepository, never()).deleteById(anyLong());
    }

    @Test
    void testDeleteCompany_Success() {
        when(companyRepository.existsById(1L)).thenReturn(true);
        when(userRepository.countByCompanyId(1L)).thenReturn(0L);

        companyService.deleteCompany(1L);

        verify(companyRepository, times(1)).deleteById(1L);
    }
}
