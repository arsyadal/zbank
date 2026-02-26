package com.zbank.service;

import com.zbank.dto.TransferRequest;
import com.zbank.dto.TransactionResponse;
import com.zbank.entity.Account;
import com.zbank.entity.Transaction;
import com.zbank.exception.BusinessException;
import com.zbank.kafka.TransactionEventPublisher;
import com.zbank.repository.AccountRepository;
import com.zbank.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TransactionEventPublisher eventPublisher;

    @InjectMocks
    private TransactionService transactionService;

    private Account sourceAccount;
    private Account destinationAccount;
    private TransferRequest transferRequest;

    @BeforeEach
    void setUp() {
        sourceAccount = Account.builder()
            .accountNumber("8801234567890123")
            .fullName("John Doe")
            .email("john@example.com")
            .balance(new BigDecimal("1000000"))
            .pin("encodedPin")
            .status(Account.AccountStatus.ACTIVE)
            .build();

        destinationAccount = Account.builder()
            .accountNumber("8809876543210987")
            .fullName("Jane Doe")
            .email("jane@example.com")
            .balance(new BigDecimal("500000"))
            .status(Account.AccountStatus.ACTIVE)
            .build();

        transferRequest = TransferRequest.builder()
            .destinationAccount("8809876543210987")
            .amount(new BigDecimal("100000"))
            .pin("123456")
            .description("Test transfer")
            .build();
    }

    @Test
    @DisplayName("Transfer - Success")
    void transfer_Success() {
        when(accountRepository.findByAccountNumberWithLock("8801234567890123"))
            .thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findByAccountNumberWithLock("8809876543210987"))
            .thenReturn(Optional.of(destinationAccount));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(transactionRepository.save(any(Transaction.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));
        when(accountRepository.save(any(Account.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        TransactionResponse response = transactionService.transfer("8801234567890123", transferRequest);

        assertNotNull(response);
        assertEquals("COMPLETED", response.getStatus());
        verify(eventPublisher).publishTransactionCompleted(any());
    }

    @Test
    @DisplayName("Transfer - Same Account")
    void transfer_SameAccount_ThrowsException() {
        TransferRequest sameAccountRequest = TransferRequest.builder()
            .destinationAccount("8801234567890123")
            .amount(new BigDecimal("100000"))
            .pin("123456")
            .build();

        assertThrows(BusinessException.class, 
            () -> transactionService.transfer("8801234567890123", sameAccountRequest));
    }

    @Test
    @DisplayName("Transfer - Insufficient Balance")
    void transfer_InsufficientBalance_ThrowsException() {
        sourceAccount.setBalance(new BigDecimal("50000"));

        when(accountRepository.findByAccountNumberWithLock("8801234567890123"))
            .thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findByAccountNumberWithLock("8809876543210987"))
            .thenReturn(Optional.of(destinationAccount));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

        assertThrows(BusinessException.class, 
            () -> transactionService.transfer("8801234567890123", transferRequest));
    }

    @Test
    @DisplayName("Transfer - Invalid PIN")
    void transfer_InvalidPin_ThrowsException() {
        when(accountRepository.findByAccountNumberWithLock("8801234567890123"))
            .thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findByAccountNumberWithLock("8809876543210987"))
            .thenReturn(Optional.of(destinationAccount));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThrows(BusinessException.class, 
            () -> transactionService.transfer("8801234567890123", transferRequest));
    }
}
