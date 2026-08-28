package com.mysterygame.servicebackend.repository;

import com.mysterygame.servicebackend.model.UserProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProgressRepository extends MongoRepository<UserProgress, String> {
    Optional<UserProgress> findByUserIdAndCaseId(String userId, String caseId);
}
