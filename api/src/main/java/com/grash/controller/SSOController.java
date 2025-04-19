package com.grash.controller;

import com.grash.dto.AuthResponse;
import com.grash.dto.SSOLoginRequest;
import com.grash.service.SSOService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/auth/sso")
@Api(tags = "sso")
@RequiredArgsConstructor
public class SSOController {

    private final SSOService ssoService;

    @PostMapping(
            path = "/login",
            produces = {
                    MediaType.APPLICATION_JSON_VALUE
            }
    )
    @PreAuthorize("permitAll()")
    @ApiOperation(value = "Login with SSO provider")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Something went wrong"),
            @ApiResponse(code = 404, message = "User not found"),
            @ApiResponse(code = 422, message = "Invalid credentials")
    })
    public ResponseEntity<AuthResponse> ssoLogin(
            @ApiParam("SSO Login Request") @Valid @RequestBody SSOLoginRequest ssoLoginRequest) {
        // The email is extracted from the token validation done by OAuth2 provider
        AuthResponse authResponse = ssoService.handleSSOLogin(ssoLoginRequest.getEmail());
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    @GetMapping("/providers")
    @PreAuthorize("permitAll()")
    @ApiOperation(value = "Get available SSO providers")
    public ResponseEntity<String[]> getProviders() {
        // Return a list of supported providers
        return ResponseEntity.ok(new String[] {"google", "microsoft", "github"});
    }
}
