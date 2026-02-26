package com.zbank.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ChangePinRequest {

    @NotBlank(message = "Current PIN is required")
    @Pattern(regexp = "\\d{6}", message = "Current PIN must be exactly 6 digits")
    private String currentPin;

    @NotBlank(message = "New PIN is required")
    @Pattern(regexp = "\\d{6}", message = "New PIN must be exactly 6 digits")
    private String newPin;
}
