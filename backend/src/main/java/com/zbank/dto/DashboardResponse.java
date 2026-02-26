package com.zbank.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    
    private String accountNumber;
    private String fullName;
    private BigDecimal balance;
    private long totalTransactions;
    private long todayTransactions;
}
