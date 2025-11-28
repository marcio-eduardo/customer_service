package com.faculdade.customer_service_back.repository.user_repository;

import com.faculdade.customer_service_back.model.user_model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByCpf(String cpf);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    Boolean existsByCpf(String cpf);
}