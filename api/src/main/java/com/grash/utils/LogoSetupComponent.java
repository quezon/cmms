package com.grash.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Component
public class LogoSetupComponent implements ApplicationRunner {

    @Value("${white-labeling.logo-path:}")
    private String customLogoPath;

    private static final String STATIC_LOGO_PATH = "src/main/resources/static/images/custom-logo.png";

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (customLogoPath != null && !customLogoPath.isEmpty()) {
            copyLogoToStaticResources();
        }
    }

    private void copyLogoToStaticResources() {
        try {
            Path source = Paths.get(customLogoPath);
            Path target = Paths.get(STATIC_LOGO_PATH);

            // Copy the file
            Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);

            System.out.println("Custom logo copied to static resources");
        } catch (IOException e) {
            System.err.println("Failed to copy custom logo: " + e.getMessage());
        }
    }
}