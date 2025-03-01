package com.grash.mapper;

import com.grash.dto.FileMiniDTO;
import com.grash.dto.FileShowDTO;
import com.grash.dto.FileShowDTO;
import com.grash.factory.StorageServiceFactory;
import com.grash.model.File;
import com.grash.model.File;
import com.grash.service.GCPService;
import com.grash.service.FileService;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

@Mapper(componentModel = "spring")
public abstract class FileMapper {

    @Lazy
    @Autowired
    private StorageServiceFactory storageServiceFactory;

    @Mappings({})
    public abstract FileMiniDTO toMiniDto(File model);

    public abstract FileShowDTO toShowDto(File model);

    @AfterMapping
    protected FileShowDTO toShowDto(File model, @MappingTarget FileShowDTO target) {
        target.setUrl(storageServiceFactory.getStorageService().generateSignedUrl(model, 60 * 3));
        return target;
    }
}
