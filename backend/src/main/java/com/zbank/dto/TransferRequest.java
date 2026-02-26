package com.zbank.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransferRequest {
    
    @NotBlank(message = "Destination account is required")
    private String destinationAccount;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1000.00", message = "Minimum transfer amount is 1,000")
    @Digits(integer = 15, fraction = 2, message = "Invalid amount format")
    private BigDecimal amount;
    
    @NotBlank(message = "PIN is required")
    @Pattern(regexp = "^\\d{6}$", message = "PIN must be exactly 6 digits")
    private String pin;
    
    @Size(max = 200, message = "Description must not exceed 200 characters")
    private String description;
}
