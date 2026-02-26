package com.zbank.service;

import com.zbank.dto.*;
import com.zbank.entity.Account;
import com.zbank.entity.Transaction;
import com.zbank.exception.BusinessException;
import com.zbank.kafka.TransactionEventPublisher;
import com.zbank.repository.AccountRepository;
import com.zbank.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {
    
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;
    private final TransactionEventPublisher eventPublisher;
    
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public TransactionResponse transfer(String sourceAccountNumber, TransferRequest request) {
        log.info("Processing transfer from {} to {}", sourceAccountNumber, request.getDestinationAccount());
        
        if (sourceAccountNumber.equals(request.getDestinationAccount())) {
            throw new BusinessException("Cannot transfer to the same account");
        }
        
        Account sourceAccount = accountRepository.findByAccountNumberWithLock(sourceAccountNumber)
            .orElseThrow(() -> BusinessException.notFound("Source account not found"));
        
        Account destinationAccount = accountRepository.findByAccountNumberWithLock(request.getDestinationAccount())
            .orElseThrow(() -> BusinessException.notFound("Destination account not found"));
        
        if (!passwordEncoder.matches(request.getPin(), sourceAccount.getPin())) {
            throw BusinessException.unauthorized("Invalid PIN");
        }
        
        if (sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new BusinessException("Insufficient balance");
        }
        
        if (destinationAccount.getStatus() != Account.AccountStatus.ACTIVE) {
            throw new BusinessException("Destination account is not active");
        }
        
        String transactionRef = generateTransactionRef("TRF");
        
        Transaction transaction = Transaction.builder()
            .transactionRef(transactionRef)
            .sourceAccount(sourceAccountNumber)
            .destinationAccount(request.getDestinationAccount())
            .amount(request.getAmount())
            .type(Transaction.TransactionType.TRANSFER)
            .description(request.getDescription())
            .status(Transaction.TransactionStatus.PROCESSING)
            .build();
        
        transaction = transactionRepository.save(transaction);
        
        try {
            sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));
            destinationAccount.setBalance(destinationAccount.getBalance().add(request.getAmount()));
            
            accountRepository.save(sourceAccount);
            accountRepository.save(destinationAccount);
            
            transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
            transaction.setProcessedAt(LocalDateTime.now());
            transaction = transactionRepository.save(transaction);
            
            eventPublisher.publishTransactionCompleted(transaction);
            
            log.info("Transfer completed: {}", transactionRef);
            
        } catch (Exception e) {
            transaction.setStatus(Transaction.TransactionStatus.FAILED);
            transaction.setFailureReason(e.getMessage());
            transactionRepository.save(transaction);
            
            log.error("Transfer failed: {}", transactionRef, e);
            throw new BusinessException("Transfer failed: " + e.getMessage());
        }
        
        return mapToResponse(transaction);
    }
    
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public TransactionResponse topUp(String accountNumber, TopUpRequest request) {
        log.info("Processing top-up for account: {}", accountNumber);
        
        Account account = accountRepository.findByAccountNumberWithLock(accountNumber)
            .orElseThrow(() -> BusinessException.notFound("Account not found"));
        
        String transactionRef = generateTransactionRef("TOP");
        
        Transaction transaction = Transaction.builder()
            .transactionRef(transactionRef)
            .sourceAccount("EXTERNAL")
            .destinationAccount(accountNumber)
            .amount(request.getAmount())
            .type(Transaction.TransactionType.TOP_UP)
            .description("Top-up from Payment Gateway" + 
                (request.getReference() != null ? " - Ref: " + request.getReference() : ""))
            .status(Transaction.TransactionStatus.PROCESSING)
            .build();
        
        transaction = transactionRepository.save(transaction);
        
        try {
            account.setBalance(account.getBalance().add(request.getAmount()));
            accountRepository.save(account);
            
            transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
            transaction.setProcessedAt(LocalDateTime.now());
            transaction = transactionRepository.save(transaction);
            
            eventPublisher.publishTransactionCompleted(transaction);
            
            log.info("Top-up completed: {}", transactionRef);
            
        } catch (Exception e) {
            transaction.setStatus(Transaction.TransactionStatus.FAILED);
            transaction.setFailureReason(e.getMessage());
            transactionRepository.save(transaction);
            
            log.error("Top-up failed: {}", transactionRef, e);
            throw new BusinessException("Top-up failed: " + e.getMessage());
        }
        
        return mapToResponse(transaction);
    }
    
    @Transactional(readOnly = true)
    public Page<TransactionResponse> getTransactionHistory(String accountNumber, Pageable pageable) {
        return transactionRepository
            .findBySourceAccountOrDestinationAccountOrderByCreatedAtDesc(accountNumber, accountNumber, pageable)
            .map(this::mapToResponse);
    }
    
    @Transactional(readOnly = true)
    public TransactionResponse getTransactionByRef(String transactionRef) {
        Transaction transaction = transactionRepository.findByTransactionRef(transactionRef)
            .orElseThrow(() -> BusinessException.notFound("Transaction not found"));
        return mapToResponse(transaction);
    }
    
    private String generateTransactionRef(String prefix) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.format("%06d", System.nanoTime() % 1000000);
        return prefix + timestamp + random;
    }
    
    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
            .id(transaction.getId())
            .transactionRef(transaction.getTransactionRef())
            .sourceAccount(transaction.getSourceAccount())
            .destinationAccount(transaction.getDestinationAccount())
            .amount(transaction.getAmount())
            .type(transaction.getType().name())
            .status(transaction.getStatus().name())
            .description(transaction.getDescription())
            .createdAt(transaction.getCreatedAt())
            .processedAt(transaction.getProcessedAt())
            .build();
    }
}
