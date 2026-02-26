package com.zbank.service;

import com.zbank.dto.LoginRequest;
import com.zbank.dto.RegisterRequest;
import com.zbank.dto.AuthResponse;
import com.zbank.entity.Account;
import com.zbank.exception.BusinessException;
import com.zbank.repository.AccountRepository;
import com.zbank.repository.TransactionRepository;
import com.zbank.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private Account account;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
            .fullName("John Doe")
            .email("john@example.com")
            .password("password123")
            .pin("123456")
            .build();

        loginRequest = LoginRequest.builder()
            .email("john@example.com")
            .password("password123")
            .build();

        account = Account.builder()
            .accountNumber("8801234567890123")
            .fullName("John Doe")
            .email("john@example.com")
            .password("encodedPassword")
            .pin("encodedPin")
            .status(Account.AccountStatus.ACTIVE)
            .build();
    }

    @Test
    @DisplayName("Register - Success")
    void register_Success() {
        when(accountRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(accountRepository.save(any(Account.class))).thenReturn(account);
        when(tokenProvider.generateToken(anyString())).thenReturn("jwt-token");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("Bearer", response.getTokenType());
        assertEquals("jwt-token", response.getToken());
        verify(accountRepository).save(any(Account.class));
    }

    @Test
    @DisplayName("Register - Email Already Exists")
    void register_EmailExists_ThrowsException() {
        when(accountRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(BusinessException.class, () -> authService.register(registerRequest));
        verify(accountRepository, never()).save(any());
    }

    @Test
    @DisplayName("Login - Success")
    void login_Success() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(mock(UsernamePasswordAuthenticationToken.class));
        when(accountRepository.findByEmail(anyString())).thenReturn(Optional.of(account));
        when(tokenProvider.generateToken(anyString())).thenReturn("jwt-token");

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("john@example.com", response.getAccount().getEmail());
    }

    @Test
    @DisplayName("Login - Invalid Credentials")
    void login_InvalidCredentials_ThrowsException() {
        when(authenticationManager.authenticate(any()))
            .thenThrow(new org.springframework.security.authentication.BadCredentialsException("Invalid"));

        assertThrows(Exception.class, () -> authService.login(loginRequest));
    }
}
