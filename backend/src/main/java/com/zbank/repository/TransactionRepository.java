package com.zbank.repository;

import com.zbank.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    
    Optional<Transaction> findByTransactionRef(String transactionRef);
    
    Page<Transaction> findBySourceAccountOrDestinationAccountOrderByCreatedAtDesc(
        String sourceAccount, String destinationAccount, Pageable pageable);
    
    Page<Transaction> findBySourceAccountOrderByCreatedAtDesc(String sourceAccount, Pageable pageable);
    
    Page<Transaction> findByDestinationAccountOrderByCreatedAtDesc(String destinationAccount, Pageable pageable);
}
