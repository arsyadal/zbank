package com.zbank.controller;

import com.zbank.dto.TopUpRequest;
import com.zbank.dto.TransactionResponse;
import com.zbank.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/external")
@RequiredArgsConstructor
public class ExternalController {
    
    private final TransactionService transactionService;
    
    @PostMapping("/topup/{accountNumber}")
    public ResponseEntity<TransactionResponse> topUp(
            @PathVariable String accountNumber,
            @Valid @RequestBody TopUpRequest request) {
        return ResponseEntity.ok(transactionService.topUp(accountNumber, request));
    }
}
