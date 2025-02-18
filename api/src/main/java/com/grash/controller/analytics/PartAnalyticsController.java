package com.grash.controller.analytics;

import com.grash.dto.DateRange;
import com.grash.dto.analytics.parts.*;
import com.grash.dto.analytics.workOrders.IncompleteWOByAsset;
import com.grash.exception.CustomException;
import com.grash.model.*;
import com.grash.model.enums.Status;
import com.grash.service.*;
import com.grash.utils.Helper;
import io.swagger.annotations.Api;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/analytics/parts")
@Api(tags = "PartAnalytics")
@RequiredArgsConstructor
public class PartAnalyticsController {

    private final UserService userService;
    private final AssetService assetService;
    private final PartCategoryService partCategoryService;
    private final WorkOrderCategoryService workOrderCategoryService;
    private final WorkOrderService workOrderService;
    private final PartConsumptionService partConsumptionService;

    @PostMapping("/consumptions/overview")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    public ResponseEntity<PartStats> getPartStats(HttpServletRequest req, @RequestBody DateRange dateRange) {
        OwnUser user = userService.whoami(req);
        if (user.canSeeAnalytics()) {
            Collection<PartConsumption> partConsumptions = partConsumptionService.findByCompanyAndCreatedAtBetween(user.getCompany().getId(), dateRange.getStart(), dateRange.getEnd());
            long totalConsumptionCost = partConsumptions.stream().mapToLong(PartConsumption::getCost).sum();
            int consumedCount = partConsumptions.stream().mapToInt(PartConsumption::getQuantity).sum();

            return ResponseEntity.ok(PartStats.builder()
                    .consumedCount(consumedCount)
                    .totalConsumptionCost(totalConsumptionCost)
                    .build());
        } else throw new CustomException("Access Denied", HttpStatus.FORBIDDEN);
    }

    @PostMapping("/consumptions/pareto")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    public ResponseEntity<List<PartConsumptionsByPart>> getPareto(HttpServletRequest req, @RequestBody DateRange dateRange) {
        OwnUser user = userService.whoami(req);
        if (user.canSeeAnalytics()) {
            Collection<PartConsumption> partConsumptions = partConsumptionService.findByCompanyAndCreatedAtBetween
                            (user.getCompany().getId(), dateRange.getStart(), dateRange.getEnd())
                    .stream().filter(partConsumption -> partConsumption.getQuantity() != 0).collect(Collectors.toList());
            Set<Part> parts = new HashSet<>(partConsumptions.stream()
                    .map(PartConsumption::getPart)
                    .collect(Collectors.toCollection(() -> new TreeSet<>(Comparator.comparingLong(Part::getId)))));
            List<PartConsumptionsByPart> result = parts.stream().map(part -> {
                long cost = partConsumptions.stream().filter(partConsumption -> partConsumption.getPart().getId().equals(part.getId())).mapToLong(PartConsumption::getCost).sum();
                return PartConsumptionsByPart.builder()
                        .id(part.getId())
                        .name(part.getName())
                        .cost(cost).build();
            }).sorted(Comparator.comparing(PartConsumptionsByPart::getCost).reversed()).collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } else throw new CustomException("Access Denied", HttpStatus.FORBIDDEN);
    }

    @PostMapping("/consumptions/assets")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    public ResponseEntity<Collection<PartConsumptionsByAsset>> getConsumptionByAsset(HttpServletRequest req, @RequestBody DateRange dateRange) {
        OwnUser user = userService.whoami(req);
        if (user.canSeeAnalytics()) {
            Collection<Asset> assets = assetService.findByCompanyAndBefore(user.getCompany().getId(), dateRange.getEnd());
            Collection<PartConsumptionsByAsset> result = new ArrayList<>();
            for (Asset asset : assets) {
                Collection<WorkOrder> workOrders = workOrderService.findByAssetAndCreatedAtBetween(asset.getId(), dateRange.getStart(), dateRange.getEnd());
                List<PartConsumption> partConsumptions = partConsumptionService.findByWorkOrders(workOrders.stream().map(WorkOrder::getId).collect(Collectors.toList()));
                long cost = partConsumptions.stream().mapToLong(PartConsumption::getCost).sum();
                result.add(PartConsumptionsByAsset.builder()
                        .cost(cost)
                        .name(asset.getName())
                        .id(asset.getId())
                        .build());
            }
            result = result.stream().filter(partConsumptionsByAsset -> partConsumptionsByAsset.getCost() != 0).collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } else throw new CustomException("Access Denied", HttpStatus.FORBIDDEN);
    }

    @PostMapping("/consumptions/parts-category")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    public ResponseEntity<Collection<PartConsumptionByCategory>> getConsumptionByPartCategory(HttpServletRequest req, @RequestBody DateRange dateRange) {
        OwnUser user = userService.whoami(req);
        if (user.canSeeAnalytics()) {
            Collection<PartCategory> partCategories = partCategoryService.findByCompanySettings(user.getCompany().getCompanySettings().getId());
            Collection<PartConsumptionByCategory> result = new ArrayList<>();
            Collection<PartConsumption> partConsumptions = partConsumptionService.findByCompanyAndCreatedAtBetween(user.getCompany().getId(), dateRange.getStart(), dateRange.getEnd());
            for (PartCategory category : partCategories) {
                long cost = partConsumptions.stream().filter(partConsumption -> partConsumption.getPart().getCategory() != null
                        && category.getId().equals(partConsumption.getPart().getCategory().getId())).mapToLong(PartConsumption::getCost).sum();
                result.add(PartConsumptionByCategory.builder()
                        .cost(cost)
                        .name(category.getName())
                        .id(category.getId())
                        .build());
            }
            return ResponseEntity.ok(result);
        } else throw new CustomException("Access Denied", HttpStatus.FORBIDDEN);
    }

    @PostMapping("/consumptions/work-order-category")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    public ResponseEntity<Collection<PartConsumptionByWOCategory>> getConsumptionByWOCategory(HttpServletRequest req, @RequestBody DateRange dateRange) {
        OwnUser user = userService.whoami(req);
        if (user.canSeeAnalytics()) {
            Collection<WorkOrderCategory> workOrderCategories = workOrderCategoryService.findByCompanySettings(user.getCompany().getCompanySettings().getId());
            Collection<PartConsumptionByWOCategory> result = new ArrayList<>();
            Collection<PartConsumption> partConsumptions = partConsumptionService.findByCompanyAndCreatedAtBetween(user.getCompany().getId(), dateRange.getStart(), dateRange.getEnd());
            for (WorkOrderCategory category : workOrderCategories) {
                long cost = partConsumptions.stream().filter(partConsumption -> partConsumption.getWorkOrder().getCategory() != null
                        && category.getId().equals(partConsumption.getWorkOrder().getCategory().getId())).mapToLong(PartConsumption::getCost).sum();
                result.add(PartConsumptionByWOCategory.builder()
                        .cost(cost)
                        .name(category.getName())
                        .id(category.getId())
                        .build());
            }
            return ResponseEntity.ok(result);
        } else throw new CustomException("Access Denied", HttpStatus.FORBIDDEN);
    }

    @PostMapping("/consumptions/date")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    public ResponseEntity<List<PartConsumptionsByMonth>> getPartConsumptionsByMonth(HttpServletRequest req, @RequestBody DateRange dateRange) {
        OwnUser user = userService.whoami(req);
        if (user.canSeeAnalytics()) {
            List<PartConsumptionsByMonth> result = new ArrayList<>();
            LocalDate endDateLocale = Helper.dateToLocalDate(dateRange.getEnd());
            LocalDate currentDate = Helper.dateToLocalDate(dateRange.getStart());
            LocalDate endDateExclusive = Helper.dateToLocalDate(dateRange.getEnd()).plusDays(1); // Include end date in the range
            long totalDaysInRange = ChronoUnit.DAYS.between(Helper.dateToLocalDate(dateRange.getStart()), endDateExclusive);
            int points = Math.toIntExact(Math.min(15, totalDaysInRange));

            for (int i = 0; i < points; i++) {
                LocalDate nextDate = currentDate.plusDays(totalDaysInRange / points); // Distribute evenly over the range
                nextDate = nextDate.isAfter(endDateLocale) ? endDateLocale : nextDate; // Adjust for the end date
                Collection<PartConsumption> partConsumptions = partConsumptionService.findByCreatedAtBetweenAndCompany(Helper.localDateToDate(currentDate), Helper.localDateToDate(nextDate), user.getCompany().getId());
                long cost = partConsumptions.stream().mapToLong(PartConsumption::getCost).sum();
                result.add(PartConsumptionsByMonth.builder()
                        .cost(cost)
                        .date(Helper.localDateToDate(currentDate)).build());
                currentDate = nextDate;
            }
            return ResponseEntity.ok(result);
        } else throw new CustomException("Access Denied", HttpStatus.FORBIDDEN);
    }
}
