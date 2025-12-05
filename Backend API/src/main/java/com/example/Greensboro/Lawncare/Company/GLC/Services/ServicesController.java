package com.example.Greensboro.Lawncare.Company.GLC.Services;

import com.example.Greensboro.Lawncare.Company.GLC.Services.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor

public class ServicesController {
    private final ServicesService servicesService;

    @PostMapping
    public ResponseEntity<Services> createService(@Valid @RequestBody Services service) {
        return ResponseEntity.ok(servicesService.createService(service));
    }
    

    @PutMapping("/{id}")
    public ResponseEntity<Services> updateService(@PathVariable Long id, @RequestBody Services serviceDetails) {
        return ResponseEntity.ok(servicesService.updateService(id, serviceDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        servicesService.deleteService(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Services> getService(@PathVariable Long id) {
        return ResponseEntity.ok(servicesService.getServiceById(id));
    }

    @GetMapping
    public ResponseEntity<List<Services>> getAvailableServices() {
        return ResponseEntity.ok(servicesService.getAvailableServices());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Services>> getAllServices() {
        return ResponseEntity.ok(servicesService.getAllServices());
    }


}
