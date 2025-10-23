package com.example.Greensboro.Lawncare.Company.GLC.Subscription;

import com.example.Greensboro.Lawncare.Company.GLC.Customer.Customer;
import com.example.Greensboro.Lawncare.Company.GLC.Provider.Provider;
import com.example.Greensboro.Lawncare.Company.GLC.Services.Services;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByCustomerAndActive(Customer customer, boolean active);
    List<Subscription> findByServices(Services services);
    List<Subscription> findByServicesProvider(Provider provider);
}
