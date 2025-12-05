package com.example.Greensboro.Lawncare.Company.GLC.Customer;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {
    private final CustomerRepository customerRepository;

    public Customer createCustomer(Customer customer) {
        if (customerRepository.existsByEmail(customer.getEmail())) {
            throw new IllegalStateException("Email already registered");
        }
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        // Update only provided fields
        if (customerDetails.getName() != null && !customerDetails.getName().isEmpty()) {
            customer.setName(customerDetails.getName());
        }
        
        if (customerDetails.getEmail() != null && !customerDetails.getEmail().isEmpty()) {
            customer.setEmail(customerDetails.getEmail());
        }
        
        if (customerDetails.getAddress() != null && !customerDetails.getAddress().isEmpty()) {
            customer.setAddress(customerDetails.getAddress());
        }
        
        if (customerDetails.getPhoneNumber() != null && !customerDetails.getPhoneNumber().isEmpty()) {
            customer.setPhoneNumber(customerDetails.getPhoneNumber());
        }
        
        // Update password if provided and not empty
        if (customerDetails.getPassword() != null && !customerDetails.getPassword().isEmpty()) {
            customer.setPassword(customerDetails.getPassword());
        }
        
        // Update card number if provided
        if (customerDetails.getCardNumber() != null) {
            customer.setCardNumber(customerDetails.getCardNumber());
        }

        return customerRepository.save(customer);
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public List<Customer> searchByAddress(String address) {
        return customerRepository.findByAddressContaining(address);
    }

    public List<Customer> searchByPhoneNumber(String phoneNumber) {
        return customerRepository.findByPhoneNumberContaining(phoneNumber);
    }

    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new EntityNotFoundException("Customer not found");
        }
        customerRepository.deleteById(id);
    }

    public Customer authenticate(String email, String password) {
        return customerRepository.findByEmail(email)
                .filter(c -> c.getPassword().equals(password))
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
    }

    // Authenticate by username (name field) and password
    public Customer authenticateByUsername(String username, String password) {
        return customerRepository.findByName(username)
                .filter(c -> c.getPassword().equals(password))
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));
    }
}
