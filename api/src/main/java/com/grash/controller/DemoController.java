package com.grash.controller;

import com.grash.dto.SignupSuccessResponse;
import com.grash.dto.SuccessResponse;
import com.grash.dto.UserSignupRequest;
import com.grash.model.OwnUser;
import com.grash.model.enums.Language;
import com.grash.service.RateLimiterService;
import com.grash.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.EntityManager;
import javax.servlet.http.HttpServletRequest;
import java.util.UUID;

@RestController
@RequestMapping("/demo")
@RequiredArgsConstructor
public class DemoController {

    private final UserService userService;
    private final EntityManager em;
    private final RateLimiterService rateLimiterService;

    @GetMapping("/generate-account")
    public SuccessResponse generateAccount(HttpServletRequest req) {
        String clientIp = req.getRemoteAddr(); // use IP as the key
        if (!rateLimiterService.resolveBucket(clientIp).tryConsume(1)) {
            return new SuccessResponse(false, "Rate limit exceeded. Try again later.");
        }
        UserSignupRequest userSignupRequest = new UserSignupRequest();
        userSignupRequest.setFirstName("Demo");
        userSignupRequest.setLastName("Account");
        userSignupRequest.setEmail(UUID.randomUUID().toString().replace("-", "") + "@demo.com");
        userSignupRequest.setPassword("demo1234");
        userSignupRequest.setPhone(UUID.randomUUID().toString().replace("-", ""));
        userSignupRequest.setCompanyName("Demo");
        userSignupRequest.setLanguage(Language.EN);
        userSignupRequest.setDemo(true);
        SignupSuccessResponse<OwnUser> response = userService.signup(userSignupRequest);
        return new SuccessResponse(response.isSuccess(), response.getMessage());
    }

}
