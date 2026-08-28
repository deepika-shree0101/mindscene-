package com.mysterygame.servicebackend.repository;

import com.mysterygame.servicebackend.model.Case;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CaseRepository extends MongoRepository<Case, String> {
    Optional<Case> findByCaseNumber(String caseNumber);
}
