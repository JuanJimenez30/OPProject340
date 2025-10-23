package com.example.Greensboro.Lawncare.Company.GLC.Subscription;

import com.example.Greensboro.Lawncare.Company.GLC.Customer.*;
import com.example.Greensboro.Lawncare.Company.GLC.Provider.*;
import com.example.Greensboro.Lawncare.Company.GLC.Services.*;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;

    public Subscription createSubscription(Subscription subscription) {
        return subscriptionRepository.save(subscription);
    }

    public Subscription updateSubscription(Long id, Subscription subscriptionDetails) {
        Subscription subscription = subscriptionRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Subscription not found"));

        subscription.setType(subscriptionDetails.getType());
        subscription.setActive(subscriptionDetails.isActive());
        subscription.setStartDate(subscriptionDetails.getStartDate());
        subscription.setEndDate(subscriptionDetails.getEndDate());

        return subscriptionRepository.save(subscription);
    }

    public Subscription getSubscriptionById(Long id) {
        return subscriptionRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Subscription not found"));
    }

    public void cancelSubscription(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Subscription not found"));
        subscription.setActive(false);
        subscriptionRepository.save(subscription);
    }

    public List<Subscription> getActiveSubscriptionsByCustomer(Customer customer) {
        return subscriptionRepository.findByCustomerAndActive(customer, true);
    }

    public List<Subscription> getSubscriptionsByServices(Services services) {
        return subscriptionRepository.findByServices(services);
    }

    public List<Subscription> getSubscriptionsByProvider(Provider provider) {
        return subscriptionRepository.findByServicesProvider(provider);
    }
}
