package com.zbank.controller;

import com.zbank.dto.AccountResponse;
import com.zbank.dto.ChangePasswordRequest;
import com.zbank.dto.ChangePinRequest;
import com.zbank.dto.DashboardResponse;
import com.zbank.security.AccountPrincipal;
import com.zbank.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping("/me")
    public ResponseEntity<AccountResponse> getCurrentAccount(@AuthenticationPrincipal AccountPrincipal principal) {
        return ResponseEntity.ok(accountService.getAccount(principal.getAccount().getAccountNumber()));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(@AuthenticationPrincipal AccountPrincipal principal) {
        return ResponseEntity.ok(accountService.getDashboard(principal.getAccount().getAccountNumber()));
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal AccountPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        accountService.changePassword(principal.getAccount().getAccountNumber(), request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    @PutMapping("/change-pin")
    public ResponseEntity<Map<String, String>> changePin(
            @AuthenticationPrincipal AccountPrincipal principal,
            @Valid @RequestBody ChangePinRequest request) {
        accountService.changePin(principal.getAccount().getAccountNumber(), request);
        return ResponseEntity.ok(Map.of("message", "PIN changed successfully"));
    }
}
