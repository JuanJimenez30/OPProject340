package com.example.Greensboro.Lawncare.Company.GLC.Subscription;

import com.example.Greensboro.Lawncare.Company.GLC.Customer.CustomerService;
import com.example.Greensboro.Lawncare.Company.GLC.Provider.ProviderService;
import com.example.Greensboro.Lawncare.Company.GLC.Services.ServicesService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {
    private final SubscriptionService subscriptionService;
    private final ServicesService servicesService;
    private final CustomerService customerService;
    private final ProviderService providerService;

    @PostMapping
    public ResponseEntity<Subscription> createSubscription(@Valid @RequestBody Subscription subscription) {
        return ResponseEntity.ok(subscriptionService.createSubscription(subscription));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subscription> updateSubscription(@PathVariable Long id, @Valid @RequestBody Subscription subscriptionDetails) {
        return ResponseEntity.ok(subscriptionService.updateSubscription(id, subscriptionDetails));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelSubscription(@PathVariable Long id) {
        subscriptionService.cancelSubscription(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Subscription>> getCustomerSubscriptions(@PathVariable Long customerId) {
        return ResponseEntity.ok(subscriptionService.getActiveSubscriptionsByCustomer(customerService.getCustomerById(customerId)));
    }

    @GetMapping("/box/{boxId}")
    public ResponseEntity<List<Subscription>> getBoxSubscriptions(@PathVariable Long boxId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByServices(servicesService.getServiceById(boxId)));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Subscription>> getProviderSubscriptions(@PathVariable Long providerId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByProvider(providerService.getProviderById(providerId)));
    }
}
