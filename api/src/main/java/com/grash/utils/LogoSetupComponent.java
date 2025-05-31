package com.grash.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    @Value("${white-labeling.logo-paths:}")
    private String customLogoPaths;

    private static final String STATIC_LOGO_PATH = "src/main/resources/static/images/custom-logo.png";

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (customLogoPaths != null && !customLogoPaths.isEmpty()) {
            copyLogoToStaticResources();
        }
    }

    private void copyLogoToStaticResources() {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(customLogoPaths);
            Path source = Paths.get(jsonNode.get("white").asText());
            Path target = Paths.get(STATIC_LOGO_PATH);

            Files.createDirectories(target.getParent());
            // Copy the file
            Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);

            System.out.println("Custom logo copied to static resources");
        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("Failed to copy custom logo: " + e.getMessage());
        }
    }
}