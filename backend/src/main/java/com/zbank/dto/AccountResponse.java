package com.zbank.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {
    
    private String accountNumber;
    private String fullName;
    private String email;
    private BigDecimal balance;
    private String status;
    private LocalDateTime createdAt;
}
