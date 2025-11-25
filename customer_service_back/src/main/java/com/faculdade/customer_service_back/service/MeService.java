package com.faculdade.customer_service_back.service;

import com.faculdade.customer_service_back.dto.ClientInfoDTO;
import com.faculdade.customer_service_back.model.client_model.ClientePf;
import com.faculdade.customer_service_back.model.client_model.ClientePJ;
import com.faculdade.customer_service_back.repository.client_repository.ClientePfRepository;
import com.faculdade.customer_service_back.repository.client_repository.ClientePJRepository;
import com.faculdade.customer_service_back.security.services.UserDetailsImpl;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MeService {

    private final ClientePfRepository clientePfRepository;
    private final ClientePJRepository clientePjRepository;

    public MeService(ClientePfRepository clientePfRepository, ClientePJRepository clientePjRepository) {
        this.clientePfRepository = clientePfRepository;
        this.clientePjRepository = clientePjRepository;
    }

    public ClientInfoDTO getClientInfo(UserDetailsImpl userDetails) {
        Long userId = userDetails.getId();

        Optional<ClientePf> pfOptional = clientePfRepository.findByUserId(userId);
        if (pfOptional.isPresent()) {
            return new ClientInfoDTO(pfOptional.get().getId(), null);
        }

        Optional<ClientePJ> pjOptional = clientePjRepository.findByUserId(userId);
        if (pjOptional.isPresent()) {
            return new ClientInfoDTO(null, pjOptional.get().getId());
        }

        return new ClientInfoDTO(null, null); // Nenhum cliente associado
    }
}
