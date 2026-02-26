package com.zbank.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopUpRequest {
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "10000.00", message = "Minimum top-up amount is 10,000")
    @Digits(integer = 15, fraction = 2, message = "Invalid amount format")
    private BigDecimal amount;
    
    @Size(max = 200, message = "Reference must not exceed 200 characters")
    private String reference;
}
