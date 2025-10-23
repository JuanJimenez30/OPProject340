package com.example.Greensboro.Lawncare.Company.GLC.Customer;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @PostMapping // Create new customer
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.createCustomer(customer));
    }

    @PutMapping("/{id}") // Update customer by ID
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @Valid @RequestBody Customer customerDetails) {
        return ResponseEntity.ok(customerService.updateCustomer(id, customerDetails));
    }

    @GetMapping("/{id}") // Get customer by ID
    public ResponseEntity<Customer> getCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @GetMapping // Get all customers
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/search/address") // Search customers by address
    public ResponseEntity<List<Customer>> searchByAddress(@RequestParam String address) {
        return ResponseEntity.ok(customerService.searchByAddress(address));
    }

    @GetMapping("/search/phone") // Search customers by phone number
    public ResponseEntity<List<Customer>> searchByPhoneNumber(@RequestParam String phoneNumber) {
        return ResponseEntity.ok(customerService.searchByPhoneNumber(phoneNumber));
    }

    @DeleteMapping("/{id}") // Delete customer by ID
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
