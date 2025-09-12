//package com.grash.controller;
//
//import com.grash.advancedsearch.SearchCriteria;
//import com.grash.dto.*;
//import com.grash.exception.CustomException;
//import com.grash.mapper.AssetMapper;
//import com.grash.model.Asset;
//import com.grash.model.Location;
//import com.grash.model.OwnUser;
//import com.grash.model.Part;
//import com.grash.model.enums.PermissionEntity;
//import com.grash.model.enums.RoleType;
//import com.grash.security.CurrentUser;
//import com.grash.service.AssetService;
//import com.grash.service.LocationService;
//import com.grash.service.PartService;
//import com.grash.service.UserService;
//import com.grash.utils.Helper;
//import io.swagger.annotations.Api;
//import io.swagger.annotations.ApiParam;
//import io.swagger.annotations.ApiResponse;
//import io.swagger.annotations.ApiResponses;
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.MessageSource;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//import springfox.documentation.annotations.ApiIgnore;
//
//import javax.persistence.EntityManager;
//import javax.servlet.http.HttpServletRequest;
//import javax.validation.Valid;
//import java.util.ArrayList;
//import java.util.Collection;
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@RestController
//@RequestMapping("/demo")
//@RequiredArgsConstructor
//public class DemoController {
//
//    private final UserService userService;
//    private final EntityManager em;
//
//    @GetMapping("/generate-account")
//    @PreAuthorize("permitAll()")
//    public UserResponseDTO generateAccount(HttpServletRequest req) {
//       return  userService.signup(); }
//
//}
