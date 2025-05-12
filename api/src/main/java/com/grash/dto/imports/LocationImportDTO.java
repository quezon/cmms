package com.grash.dto.imports;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@Data
@NoArgsConstructor
public class LocationImportDTO {

    private Long id;
    private String name;

    private String address;

    private Double longitude;

    private Double latitude;

    private String parentLocationName;

    private Collection<String> workersEmails;

    private Collection<String> teamsNames;

    private Collection<String> customersNames;

    private Collection<String> vendorsNames;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LocationImportDTO that = (LocationImportDTO) o;
        return java.util.Objects.equals(name, that.name) &&
                java.util.Objects.equals(parentLocationName, that.parentLocationName);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(name, parentLocationName);
    }
}
