package com.faculdade.customer_service_back.repository.moderator_repository;

import com.faculdade.customer_service_back.model.moderator_model.ModeratorUser;
import com.faculdade.customer_service_back.model.user_model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModeratorUserRepository extends JpaRepository<ModeratorUser, Long> {

    Optional<ModeratorUser> findByUser(User user);

    Optional<ModeratorUser> findByUserId(Long userId);

    List<ModeratorUser> findByActive(Boolean active);

    List<ModeratorUser> findByDepartment(String department);

    List<ModeratorUser> findByAccessLevel(Integer accessLevel);

    List<ModeratorUser> findByAccessLevelGreaterThanEqual(Integer accessLevel);

    Boolean existsByUserId(Long userId);
}
