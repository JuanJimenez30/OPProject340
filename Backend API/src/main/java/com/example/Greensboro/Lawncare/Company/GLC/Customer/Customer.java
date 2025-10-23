package com.example.Greensboro.Lawncare.Company.GLC.Customer;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.Greensboro.Lawncare.Company.GLC.Subscription.Subscription;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "customers")
// Customer entity representing a customer in the system
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Name field
    @NotBlank
    @Column(nullable = false)
    private String name;

    // Email field
    @Email
    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;

    // Password field
    @NotBlank
    @Column(nullable = false)
    private String password;

    // Subscriptions
    @OneToMany(mappedBy = "customer")
    @JsonIgnoreProperties("customer")
    private List<Subscription> subscriptions = new ArrayList<>();

    // Address field
    @NotBlank
    @Column(name = "address", nullable = false)
    private String address;

    private String phoneNumber;

    private Long cardNumber;

    // Constructor with ID
    public Customer(Long id) {
        this.id = id;
    }

}
