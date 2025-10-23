package com.example.Greensboro.Lawncare.Company.GLC.Reviews;

import com.example.Greensboro.Lawncare.Company.GLC.Customer.Customer;
import com.example.Greensboro.Lawncare.Company.GLC.Provider.Provider;
import com.example.Greensboro.Lawncare.Company.GLC.Services.Services;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewsRepository extends JpaRepository<Reviews, Long> {
    List<Reviews> findByService(Services service);
    List<Reviews> findByCustomer(Customer customer);
    List<Reviews> findByServiceProvider(Provider provider);
}


