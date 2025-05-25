package com.faculdade.customer_service_back.security.services;

import com.faculdade.customer_service_back.model.user_model.User;
import com.faculdade.customer_service_back.repository.user_repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service // Marca esta classe como um serviço Spring
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository; // Injecção do nosso UserRepository

    @Override
    @Transactional // Garante que as operações com a entidade (como carregar roles LAZY) ocorram dentro de uma transação
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Busca o utilizador no banco de dados pelo nome de utilizador
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilizador não encontrado com o nome: " + username));

        // Constrói e retorna um UserDetailsImpl com base na entidade User encontrada
        return UserDetailsImpl.build(user);
    }
}