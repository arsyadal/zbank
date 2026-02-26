package com.zbank.service;

import com.zbank.dto.AccountResponse;
import com.zbank.dto.ChangePasswordRequest;
import com.zbank.dto.ChangePinRequest;
import com.zbank.dto.DashboardResponse;
import com.zbank.entity.Account;
import com.zbank.exception.BusinessException;
import com.zbank.repository.AccountRepository;
import com.zbank.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional(readOnly = true)
    public AccountResponse getAccount(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> BusinessException.notFound("Account not found"));
        
        return AccountResponse.builder()
            .accountNumber(account.getAccountNumber())
            .fullName(account.getFullName())
            .email(account.getEmail())
            .balance(account.getBalance())
            .status(account.getStatus().name())
            .createdAt(account.getCreatedAt())
            .build();
    }
    
    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> BusinessException.notFound("Account not found"));
        
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        
        long totalTransactions = transactionRepository
            .findBySourceAccountOrDestinationAccountOrderByCreatedAtDesc(accountNumber, accountNumber, 
                org.springframework.data.domain.Pageable.unpaged())
            .getTotalElements();
        
        long todayTransactions = transactionRepository
            .findBySourceAccountOrDestinationAccountOrderByCreatedAtDesc(accountNumber, accountNumber,
                org.springframework.data.domain.Pageable.unpaged())
            .stream()
            .filter(t -> t.getCreatedAt().isAfter(startOfDay))
            .count();
        
        return DashboardResponse.builder()
            .accountNumber(account.getAccountNumber())
            .fullName(account.getFullName())
            .balance(account.getBalance())
            .totalTransactions(totalTransactions)
            .todayTransactions(todayTransactions)
            .build();
    }

    @Transactional
    public void changePassword(String accountNumber, ChangePasswordRequest request) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> BusinessException.notFound("Account not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), account.getPassword())) {
            throw BusinessException.unauthorized("Current password is incorrect");
        }

        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(account);
    }

    @Transactional
    public void changePin(String accountNumber, ChangePinRequest request) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> BusinessException.notFound("Account not found"));

        if (!passwordEncoder.matches(request.getCurrentPin(), account.getPin())) {
            throw BusinessException.unauthorized("Current PIN is incorrect");
        }

        account.setPin(passwordEncoder.encode(request.getNewPin()));
        accountRepository.save(account);
    }
}
