package com.grash.service;

import com.grash.dto.AuthResponse;
import com.grash.exception.CustomException;
import com.grash.model.OwnUser;
import com.grash.repository.UserRepository;
import com.grash.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SSOService {
    
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    
    /**
     * Handles SSO login by generating JWT token for authenticated user
     * 
     * @param email The email address authenticated by SSO provider
     * @return AuthResponse containing JWT token
     */
    public AuthResponse handleSSOLogin(String email) {
        log.info("Handling SSO login for: {}", email);
        
        Optional<OwnUser> userOptional = userRepository.findByEmailIgnoreCase(email);
        
        if (!userOptional.isPresent()) {
            throw new CustomException("User not found with email: " + email, HttpStatus.NOT_FOUND);
        }
        
        OwnUser user = userOptional.get();
        
        // Update last login date
        user.setLastLogin(new java.util.Date());
        userRepository.save(user);
        
        // Generate JWT token
        String token = jwtTokenProvider.createToken(
            user.getEmail(), 
            Collections.singletonList(user.getRole().getRoleType())
        );
        
        return new AuthResponse(token);
    }
    
    /**
     * Links an existing user with an SSO provider
     * 
     * @param user The user to link
     * @param provider The SSO provider name (google, microsoft, github, etc.)
     * @param providerId The unique ID from the provider
     */
    public void linkUserWithSSOProvider(OwnUser user, String provider, String providerId) {
        log.info("Linking user {} with SSO provider: {}", user.getEmail(), provider);
        
        user.setSsoProvider(provider);
        user.setSsoProviderId(providerId);
        userRepository.save(user);
    }
}
