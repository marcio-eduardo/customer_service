package com.faculdade.customer_service_back.service.moderator_service;

import com.faculdade.customer_service_back.model.moderator_model.ModeratorUser;
import com.faculdade.customer_service_back.model.user_model.User;
import com.faculdade.customer_service_back.repository.moderator_repository.ModeratorUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ModeratorUserService {

    private final ModeratorUserRepository moderatorUserRepository;

    public ModeratorUserService(ModeratorUserRepository moderatorUserRepository) {
        this.moderatorUserRepository = moderatorUserRepository;
    }

    @Transactional(readOnly = true)
    public List<ModeratorUser> findAll() {
        return moderatorUserRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<ModeratorUser> findById(Long id) {
        return moderatorUserRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<ModeratorUser> findByUserId(Long userId) {
        return moderatorUserRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Optional<ModeratorUser> findByUser(User user) {
        return moderatorUserRepository.findByUser(user);
    }

    @Transactional(readOnly = true)
    public List<ModeratorUser> findByActive(Boolean active) {
        return moderatorUserRepository.findByActive(active);
    }

    @Transactional(readOnly = true)
    public List<ModeratorUser> findByDepartment(String department) {
        return moderatorUserRepository.findByDepartment(department);
    }

    @Transactional(readOnly = true)
    public List<ModeratorUser> findByAccessLevel(Integer accessLevel) {
        return moderatorUserRepository.findByAccessLevel(accessLevel);
    }

    @Transactional
    public ModeratorUser save(ModeratorUser moderatorUser) {
        return moderatorUserRepository.save(moderatorUser);
    }

    @Transactional
    public void deleteById(Long id) {
        moderatorUserRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean existsByUserId(Long userId) {
        return moderatorUserRepository.existsByUserId(userId);
    }
}
