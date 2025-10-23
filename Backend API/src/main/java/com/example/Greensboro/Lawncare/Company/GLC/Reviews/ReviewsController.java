package com.example.Greensboro.Lawncare.Company.GLC.Reviews;

import com.example.Greensboro.Lawncare.Company.GLC.Customer.CustomerService;
import com.example.Greensboro.Lawncare.Company.GLC.Provider.ProviderService;
import com.example.Greensboro.Lawncare.Company.GLC.Services.Services;
import com.example.Greensboro.Lawncare.Company.GLC.Services.ServicesService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.security.Provider.Service;
import java.util.HashMap;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewsController {
    private final ReviewsService reviewService;
    private final ServicesService servicesService;
    private  final CustomerService customerService;
    private final ProviderService providerService;

    @PostMapping
    public ResponseEntity<Reviews> createReview(@Valid @RequestBody Reviews review) {
        return ResponseEntity.ok(reviewService.createReview(review));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reviews> getReviewById(@PathVariable Long id) {
        Reviews review = reviewService.getReviewById(id);
        return ResponseEntity.ok(review);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reviews> updateReview(@PathVariable Long id, @Valid @RequestBody Reviews reviewDetails) {
        return ResponseEntity.ok(reviewService.updateReview(id, reviewDetails));
    }

    @PostMapping("/{id}/provider-response")
    public ResponseEntity<Reviews> addProviderResponse(@PathVariable Long id, @RequestBody String response) {
        return ResponseEntity.ok(reviewService.addProviderResponse(id, response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Reviews>> getServiceReviews(@PathVariable Long serviceId) {
        return ResponseEntity.ok(reviewService.getReviewsByService(servicesService.getServiceById(serviceId)));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Reviews>> getCustomerReviews(@PathVariable Long customerId) {
        return ResponseEntity.ok(reviewService.getReviewsByCustomer(customerService.getCustomerById(customerId)));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Reviews>> getProviderReviews(@PathVariable Long providerId) {
        return ResponseEntity.ok(reviewService.getReviewsByServiceProvider(providerService.getProviderById(providerId)));
    }

    @GetMapping("/services/{servicesId}/ratings")
    public ResponseEntity<Map<String, Double>> getServicesRatings(@PathVariable Long servicesId) {
        Services services = servicesService.getServiceById(servicesId);
        Map<String, Double> ratings = new HashMap<>();
        ratings.put("overall", reviewService.getAverageOverallRating(services));
        return ResponseEntity.ok(ratings);
    }
}
