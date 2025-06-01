package com.grash.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BrandingService {

    @Value("${white-labeling.custom-colors:#{null}}")
    private String customColors;

    public String getMailBackgroundColor() {
        String backgroundColor = "#00A0E3";
        if (customColors != null && !customColors.isEmpty()) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                JsonNode node = mapper.readTree(customColors);
                backgroundColor = node.get("emailColors").asText();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return backgroundColor;
    }
}
