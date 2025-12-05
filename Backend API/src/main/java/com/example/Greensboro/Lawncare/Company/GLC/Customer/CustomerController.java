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
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customerDetails) {
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

    // POST /api/customers/login  - simple authentication endpoint for static frontend
    @PostMapping("/login")
    public ResponseEntity<Customer> login(@RequestBody LoginRequest req) {
        // login using username (mapped to Customer.name)
        Customer authenticated = customerService.authenticateByUsername(req.getUsername(), req.getPassword());
        return ResponseEntity.ok(authenticated);
    }

    // small DTO for login JSON (username + password)
    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
