package com.grash.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
public class SSOLoginRequest {
    
    @NotNull
    @Email
    private String email;
    
    @NotNull
    private String provider;  // "google", "microsoft", "github", etc.
    
    private String providerId; // ID from the provider
}
