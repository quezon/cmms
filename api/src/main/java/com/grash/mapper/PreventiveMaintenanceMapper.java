package com.grash.mapper;

import com.grash.dto.*;
import com.grash.model.PreventiveMaintenance;
import com.grash.model.WorkOrder;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface PreventiveMaintenanceMapper {
    PreventiveMaintenance updatePreventiveMaintenance(@MappingTarget PreventiveMaintenance entity, PreventiveMaintenancePatchDTO dto);

    @Mappings({})
    PreventiveMaintenancePatchDTO toPatchDto(PreventiveMaintenance model);

    PreventiveMaintenanceShowDTO toShowDto(PreventiveMaintenance model);

    PreventiveMaintenance toModel(PreventiveMaintenancePostDTO dto);

    PreventiveMaintenanceMiniDTO toMiniDto(PreventiveMaintenance model);

    WorkOrderBaseMiniDTO toBaseMiniDto(PreventiveMaintenance model);

}
