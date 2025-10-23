package com.example.Greensboro.Lawncare.Company.GLC.Reviews;

import com.example.Greensboro.Lawncare.Company.GLC.Customer.Customer;
import com.example.Greensboro.Lawncare.Company.GLC.Provider.Provider;
import com.example.Greensboro.Lawncare.Company.GLC.Services.Services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.OptionalDouble;

@Service
@RequiredArgsConstructor
@Transactional

public class ReviewsService {

    private final ReviewsRepository reviewsRepository;
    public double getAverageOverallRating(Services service) {
        List<Reviews> reviews = reviewsRepository.findByService(service);
        OptionalDouble average = reviews.stream()
                .mapToDouble(review -> review.getOverallRating() != null ? review.getOverallRating() : 0.0)
                .average();
        return average.orElse(0.0);
    }

    public Reviews createReview(Reviews review) {
        return reviewsRepository.save(review);
    }

    public Reviews addProviderResponse(Long id, String response) {
        Reviews review = reviewsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));

        review.setProviderResponse(response);
        review.setProviderResponseDate(LocalDateTime.now());
        return reviewsRepository.save(review);
    }

    public void deleteReview(Long id) {
        if (!reviewsRepository.existsById(id)) {
            throw new EntityNotFoundException("Review not found");
        }
        reviewsRepository.deleteById(id);
    }

    public List<Reviews> getReviewsByService(Services service) {
        return reviewsRepository.findByService(service);
    }

    public List<Reviews> getReviewsByCustomer(Customer customer) {
        return reviewsRepository.findByCustomer(customer);
    }

    public List<Reviews> getReviewsByServiceProvider(Provider provider) {
        return reviewsRepository.findByServiceProvider(provider);
    }
}
