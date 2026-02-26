package com.zbank.service;

import com.zbank.dto.*;
import com.zbank.entity.Account;
import com.zbank.exception.BusinessException;
import com.zbank.repository.AccountRepository;
import com.zbank.repository.TransactionRepository;
import com.zbank.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final TransactionRepository transactionRepository;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (accountRepository.existsByEmail(request.getEmail())) {
            throw BusinessException.conflict("Email already registered");
        }
        
        String accountNumber = generateAccountNumber();
        while (accountRepository.existsByAccountNumber(accountNumber)) {
            accountNumber = generateAccountNumber();
        }
        
        Account account = Account.builder()
            .accountNumber(accountNumber)
            .fullName(request.getFullName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .pin(passwordEncoder.encode(request.getPin()))
            .status(Account.AccountStatus.ACTIVE)
            .build();
        
        account = accountRepository.save(account);
        
        String token = tokenProvider.generateToken(account.getEmail());
        
        return AuthResponse.builder()
            .token(token)
            .tokenType("Bearer")
            .expiresIn(tokenProvider.getExpiration())
            .account(AuthResponse.AccountInfo.builder()
                .accountNumber(account.getAccountNumber())
                .fullName(account.getFullName())
                .email(account.getEmail())
                .build())
            .build();
    }
    
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        Account account = accountRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> BusinessException.unauthorized("Invalid credentials"));
        
        if (account.getStatus() != Account.AccountStatus.ACTIVE) {
            throw BusinessException.forbidden("Account is not active");
        }
        
        String token = tokenProvider.generateToken(account.getEmail());
        
        return AuthResponse.builder()
            .token(token)
            .tokenType("Bearer")
            .expiresIn(tokenProvider.getExpiration())
            .account(AuthResponse.AccountInfo.builder()
                .accountNumber(account.getAccountNumber())
                .fullName(account.getFullName())
                .email(account.getEmail())
                .build())
            .build();
    }
    
    private String generateAccountNumber() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder("88");
        for (int i = 0; i < 14; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}
