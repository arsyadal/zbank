package com.zbank.controller;

import com.zbank.dto.TransactionResponse;
import com.zbank.dto.TransferRequest;
import com.zbank.security.AccountPrincipal;
import com.zbank.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    
    private final TransactionService transactionService;
    
    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(
            @AuthenticationPrincipal AccountPrincipal principal,
            @Valid @RequestBody TransferRequest request) {
        return ResponseEntity.ok(
            transactionService.transfer(principal.getAccount().getAccountNumber(), request)
        );
    }
    
    @GetMapping("/history")
    public ResponseEntity<Page<TransactionResponse>> getHistory(
            @AuthenticationPrincipal AccountPrincipal principal,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(
            transactionService.getTransactionHistory(principal.getAccount().getAccountNumber(), pageable)
        );
    }
    
    @GetMapping("/{transactionRef}")
    public ResponseEntity<TransactionResponse> getTransaction(
            @AuthenticationPrincipal AccountPrincipal principal,
            @PathVariable String transactionRef) {
        return ResponseEntity.ok(transactionService.getTransactionByRef(transactionRef));
    }
}
